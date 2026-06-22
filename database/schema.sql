-- Yunlv Wuyou MVP core data tables.
-- Source: 10.1 core data table recommendation.
-- Quoted table names keep the document names "user" and "order" intact.

CREATE TABLE IF NOT EXISTS "user" (
  id VARCHAR(64) PRIMARY KEY,
  phone VARCHAR(32) NOT NULL,
  nickname VARCHAR(80) NOT NULL,
  role VARCHAR(32) NOT NULL,
  avatar TEXT,
  status VARCHAR(32) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS elder_profile (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) NOT NULL,
  name VARCHAR(80) NOT NULL,
  gender VARCHAR(16) NOT NULL,
  age INTEGER NOT NULL,
  health_tags TEXT NOT NULL,
  address TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES "user"(id)
);

CREATE TABLE IF NOT EXISTS family_contact (
  id VARCHAR(64) PRIMARY KEY,
  elder_id VARCHAR(64) NOT NULL,
  name VARCHAR(80) NOT NULL,
  relation VARCHAR(32) NOT NULL,
  phone VARCHAR(32) NOT NULL,
  is_default BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (elder_id) REFERENCES elder_profile(id)
);

CREATE TABLE IF NOT EXISTS guide (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) NOT NULL,
  real_name VARCHAR(80) NOT NULL,
  service_types TEXT NOT NULL,
  area VARCHAR(120) NOT NULL,
  status VARCHAR(32) NOT NULL,
  rating DECIMAL(3, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES "user"(id)
);

CREATE TABLE IF NOT EXISTS merchant (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  type VARCHAR(80) NOT NULL,
  license VARCHAR(120) NOT NULL,
  contact VARCHAR(80) NOT NULL,
  address TEXT NOT NULL,
  status VARCHAR(32) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS service_item (
  id VARCHAR(64) PRIMARY KEY,
  provider_type VARCHAR(32) NOT NULL,
  provider_id VARCHAR(64) NOT NULL,
  title VARCHAR(160) NOT NULL,
  category VARCHAR(80) NOT NULL,
  price DECIMAL(10, 2) NOT NULL DEFAULT 0,
  status VARCHAR(32) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "order" (
  id VARCHAR(64) PRIMARY KEY,
  order_no VARCHAR(64) UNIQUE NOT NULL,
  user_id VARCHAR(64) NOT NULL,
  service_type VARCHAR(120) NOT NULL,
  provider_type VARCHAR(32) NOT NULL,
  status VARCHAR(32) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
  time VARCHAR(32) NOT NULL,
  location TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES "user"(id)
);

CREATE TABLE IF NOT EXISTS task (
  id VARCHAR(64) PRIMARY KEY,
  order_id VARCHAR(64) NOT NULL,
  assignee_type VARCHAR(32) NOT NULL,
  assignee_id VARCHAR(64) NOT NULL,
  status VARCHAR(32) NOT NULL,
  dispatch_rule VARCHAR(160) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES "order"(id)
);

CREATE TABLE IF NOT EXISTS activity (
  id VARCHAR(64) PRIMARY KEY,
  title VARCHAR(160) NOT NULL,
  category VARCHAR(80) NOT NULL,
  time VARCHAR(32) NOT NULL,
  location TEXT NOT NULL,
  coordinates TEXT NOT NULL,
  quota INTEGER NOT NULL DEFAULT 0,
  status VARCHAR(32) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS device (
  id VARCHAR(64) PRIMARY KEY,
  device_id VARCHAR(80) UNIQUE NOT NULL,
  type VARCHAR(80) NOT NULL,
  user_id VARCHAR(64) NOT NULL,
  battery INTEGER NOT NULL DEFAULT 0,
  online_status VARCHAR(32) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES "user"(id)
);

CREATE TABLE IF NOT EXISTS health_record (
  id VARCHAR(64) PRIMARY KEY,
  elder_id VARCHAR(64) NOT NULL,
  metric_type VARCHAR(80) NOT NULL,
  value VARCHAR(80) NOT NULL,
  unit VARCHAR(32) NOT NULL,
  source VARCHAR(80) NOT NULL,
  recorded_at VARCHAR(32) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (elder_id) REFERENCES elder_profile(id)
);

CREATE TABLE IF NOT EXISTS alert (
  id VARCHAR(64) PRIMARY KEY,
  elder_id VARCHAR(64) NOT NULL,
  type VARCHAR(80) NOT NULL,
  level VARCHAR(32) NOT NULL,
  location TEXT NOT NULL,
  status VARCHAR(32) NOT NULL,
  handled_by VARCHAR(80),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (elder_id) REFERENCES elder_profile(id)
);

CREATE TABLE IF NOT EXISTS ai_chat (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) NOT NULL,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  intent VARCHAR(80) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES "user"(id)
);

CREATE INDEX IF NOT EXISTS idx_elder_profile_user_id ON elder_profile(user_id);
CREATE INDEX IF NOT EXISTS idx_family_contact_elder_id ON family_contact(elder_id);
CREATE INDEX IF NOT EXISTS idx_guide_user_id ON guide(user_id);
CREATE INDEX IF NOT EXISTS idx_service_item_provider ON service_item(provider_type, provider_id);
CREATE INDEX IF NOT EXISTS idx_order_user_status ON "order"(user_id, status);
CREATE INDEX IF NOT EXISTS idx_task_order_status ON task(order_id, status);
CREATE INDEX IF NOT EXISTS idx_activity_category_status ON activity(category, status);
CREATE INDEX IF NOT EXISTS idx_device_user_status ON device(user_id, online_status);
CREATE INDEX IF NOT EXISTS idx_health_record_elder_time ON health_record(elder_id, recorded_at);
CREATE INDEX IF NOT EXISTS idx_alert_elder_status ON alert(elder_id, status);
CREATE INDEX IF NOT EXISTS idx_ai_chat_user_time ON ai_chat(user_id, created_at);
