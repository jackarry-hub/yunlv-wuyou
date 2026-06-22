#!/bin/bash
# ========================================
# 云旅无忧 数据库备份脚本
# 支持：MySQL 全量备份 + JSON数据备份
# 用法：./07-database-backup.sh [mysql|json|all]
# 建议：配合 crontab 每日自动执行
# ========================================

set -euo pipefail

# ── 配置 ──────────────────────────────────
BACKUP_DIR="/data/backups/yunlv-wuyou"
RETENTION_DAYS=30
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

# MySQL 配置（从环境变量或默认值）
DB_HOST="${DB_HOST:-127.0.0.1}"
DB_PORT="${DB_PORT:-3306}"
DB_NAME="${DB_NAME:-yunlv_wuyou}"
DB_USER="${DB_USER:-yunlv}"
DB_PASSWORD="${DB_PASSWORD:-}"

# JSON 数据文件路径
JSON_DB_PATH="${YUNLV_RUNTIME_DIR:-.runtime}/mock-db.json"
SEED_DB_PATH="data/mock-db.json"

# 通知（可选）
NOTIFY_WEBHOOK="${BACKUP_NOTIFY_WEBHOOK:-}"

# ── 函数 ──────────────────────────────────

log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1"
}

ensure_dir() {
    mkdir -p "$BACKUP_DIR/mysql"
    mkdir -p "$BACKUP_DIR/json"
    mkdir -p "$BACKUP_DIR/logs"
}

# MySQL 全量备份
backup_mysql() {
    log "开始 MySQL 备份..."
    
    local backup_file="$BACKUP_DIR/mysql/${DB_NAME}_${TIMESTAMP}.sql.gz"
    
    mysqldump \
        --host="$DB_HOST" \
        --port="$DB_PORT" \
        --user="$DB_USER" \
        --password="$DB_PASSWORD" \
        --single-transaction \
        --routines \
        --triggers \
        --set-gtid-purged=OFF \
        --databases "$DB_NAME" \
        2>>"$BACKUP_DIR/logs/backup_${TIMESTAMP}.log" \
        | gzip > "$backup_file"
    
    local size=$(du -sh "$backup_file" | cut -f1)
    log "MySQL 备份完成: $backup_file ($size)"
    echo "$backup_file"
}

# JSON 数据文件备份
backup_json() {
    log "开始 JSON 数据备份..."
    
    local backup_file="$BACKUP_DIR/json/mock-db_${TIMESTAMP}.json.gz"
    
    if [ -f "$JSON_DB_PATH" ]; then
        gzip -c "$JSON_DB_PATH" > "$backup_file"
        local size=$(du -sh "$backup_file" | cut -f1)
        log "JSON 备份完成: $backup_file ($size)"
    else
        log "警告: JSON数据文件不存在 ($JSON_DB_PATH)，尝试备份种子文件..."
        if [ -f "$SEED_DB_PATH" ]; then
            gzip -c "$SEED_DB_PATH" > "$backup_file"
            log "种子数据备份完成: $backup_file"
        else
            log "错误: 没有找到可备份的JSON文件"
            return 1
        fi
    fi
    echo "$backup_file"
}

# 清理过期备份
cleanup_old_backups() {
    log "清理 ${RETENTION_DAYS} 天前的备份..."
    
    local deleted_count=0
    
    while IFS= read -r -d '' file; do
        rm -f "$file"
        ((deleted_count++))
    done < <(find "$BACKUP_DIR" -name "*.gz" -mtime +$RETENTION_DAYS -print0 2>/dev/null)
    
    # 同时清理旧日志
    find "$BACKUP_DIR/logs" -name "*.log" -mtime +$RETENTION_DAYS -delete 2>/dev/null || true
    
    log "已清理 $deleted_count 个过期文件"
}

# 验证备份完整性
verify_backup() {
    local file="$1"
    
    if [ ! -f "$file" ]; then
        log "错误: 备份文件不存在 - $file"
        return 1
    fi
    
    # 验证 gzip 完整性
    if ! gzip -t "$file" 2>/dev/null; then
        log "错误: 备份文件损坏 - $file"
        return 1
    fi
    
    log "备份验证通过: $file"
    return 0
}

# 发送通知
send_notification() {
    local status="$1"
    local message="$2"
    
    if [ -z "$NOTIFY_WEBHOOK" ]; then
        return 0
    fi
    
    curl -s -X POST "$NOTIFY_WEBHOOK" \
        -H "Content-Type: application/json" \
        -d "{\"status\":\"$status\",\"message\":\"$message\",\"timestamp\":\"$TIMESTAMP\"}" \
        >/dev/null 2>&1 || true
}

# MySQL 恢复
restore_mysql() {
    local backup_file="$1"
    
    if [ ! -f "$backup_file" ]; then
        log "错误: 备份文件不存在 - $backup_file"
        return 1
    fi
    
    log "开始恢复 MySQL 数据库..."
    log "警告: 这将覆盖当前数据库 $DB_NAME 的所有数据！"
    
    gunzip -c "$backup_file" | mysql \
        --host="$DB_HOST" \
        --port="$DB_PORT" \
        --user="$DB_USER" \
        --password="$DB_PASSWORD"
    
    log "MySQL 恢复完成"
}

# JSON 恢复
restore_json() {
    local backup_file="$1"
    
    if [ ! -f "$backup_file" ]; then
        log "错误: 备份文件不存在 - $backup_file"
        return 1
    fi
    
    log "开始恢复 JSON 数据..."
    
    # 先备份当前文件
    if [ -f "$JSON_DB_PATH" ]; then
        cp "$JSON_DB_PATH" "${JSON_DB_PATH}.before-restore"
    fi
    
    gunzip -c "$backup_file" > "$JSON_DB_PATH"
    log "JSON 恢复完成: $JSON_DB_PATH"
}

# ── 主逻辑 ────────────────────────────────

main() {
    local mode="${1:-all}"
    
    log "========================================="
    log "云旅无忧 数据库备份 - 模式: $mode"
    log "========================================="
    
    ensure_dir
    
    case "$mode" in
        mysql)
            local file=$(backup_mysql)
            verify_backup "$file"
            ;;
        json)
            local file=$(backup_json)
            verify_backup "$file"
            ;;
        all)
            # 根据 DB_CLIENT 决定备份策略
            if [ "${DB_CLIENT:-json}" = "mysql" ]; then
                local mysql_file=$(backup_mysql)
                verify_backup "$mysql_file"
            fi
            local json_file=$(backup_json)
            verify_backup "$json_file"
            ;;
        restore-mysql)
            restore_mysql "${2:-}"
            ;;
        restore-json)
            restore_json "${2:-}"
            ;;
        cleanup)
            cleanup_old_backups
            ;;
        *)
            echo "用法: $0 [mysql|json|all|restore-mysql <file>|restore-json <file>|cleanup]"
            exit 1
            ;;
    esac
    
    # 清理过期备份
    if [ "$mode" != "cleanup" ] && [ "$mode" != "restore-mysql" ] && [ "$mode" != "restore-json" ]; then
        cleanup_old_backups
    fi
    
    log "备份任务完成"
    send_notification "success" "数据库备份完成 - 模式: $mode"
}

main "$@"

# ── Crontab 配置示例 ──────────────────────
# 每日凌晨3点执行全量备份：
# 0 3 * * * /opt/yunlv-wuyou/deliverables/07-database-backup.sh all >> /var/log/yunlv-backup.log 2>&1
#
# 每6小时备份JSON数据：
# 0 */6 * * * /opt/yunlv-wuyou/deliverables/07-database-backup.sh json >> /var/log/yunlv-backup.log 2>&1
#
# 每周日清理过期备份：
# 0 4 * * 0 /opt/yunlv-wuyou/deliverables/07-database-backup.sh cleanup >> /var/log/yunlv-backup.log 2>&1
