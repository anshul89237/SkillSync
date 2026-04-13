-- ============================================================
-- SkillSync - Initial Data Seed Script (FIXED)
-- ============================================================

-- ============================================================
-- 1. Authentication Service Data (skillsync_auth)
-- ============================================================
\c skillsync_auth

-- Clear existing demo IDs to avoid conflicts
DELETE FROM auth.users WHERE id BETWEEN 1 AND 10;

INSERT INTO auth.users (id, email, password_hash, first_name, last_name, role, is_active, is_verified, password_set, created_at, updated_at) VALUES 
(1, 'anshulkumar94122@gmail.com', '$2b$12$B3nRvAhM3fsRfwXJZDCpw.8MsQoopoUtKCObDqr9NQ9I9j4fIbebq', 'Anshul', 'Kumar', 'ROLE_ADMIN', true, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 'hiimissav@gmail.com', '$2b$12$B3nRvAhM3fsRfwXJZDCpw.8MsQoopoUtKCObDqr9NQ9I9j4fIbebq', 'Anjali', 'Viswakarma', 'ROLE_LEARNER', true, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 'uadayasribasawoju@gmail.com', '$2b$12$B3nRvAhM3fsRfwXJZDCpw.8MsQoopoUtKCObDqr9NQ9I9j4fIbebq', 'Udaya', 'Sri', 'ROLE_LEARNER', true, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(4, 'aksahoo1097@gmail.com', '$2b$12$B3nRvAhM3fsRfwXJZDCpw.8MsQoopoUtKCObDqr9NQ9I9j4fIbebq', 'Anjan Kumar', 'Sahoo', 'ROLE_MENTOR', true, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(5, 'rangabattulla45@gmail.com', '$2b$12$B3nRvAhM3fsRfwXJZDCpw.8MsQoopoUtKCObDqr9NQ9I9j4fIbebq', 'Ranga', 'Raju', 'ROLE_MENTOR', true, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;


SELECT setval(pg_get_serial_sequence('auth.users', 'id'), coalesce(max(id),0) + 1, false) FROM auth.users;


-- ============================================================
-- 2. Profile & Mentor Data (skillsync_user)
-- ============================================================
\c skillsync_user

DELETE FROM users.profiles WHERE id BETWEEN 1 AND 10;
DELETE FROM mentors.mentor_profiles WHERE id BETWEEN 1 AND 10;

INSERT INTO users.profiles (id, user_id, first_name, last_name, profile_complete_pct, created_at, updated_at) VALUES
(1, 1, 'Anshul', 'Kumar', 100, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 2, 'Anjali', 'Viswakarma', 100, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 3, 'Udaya', 'Sri', 100, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(4, 4, 'Anjan Kumar', 'Sahoo', 100, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(6, 6, 'Ranga', 'Raju', 100, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

SELECT setval(pg_get_serial_sequence('users.profiles', 'id'), coalesce(max(id),0) + 1, false) FROM users.profiles;

INSERT INTO mentors.mentor_profiles (id, user_id, bio, experience_years, hourly_rate, avg_rating, total_reviews, total_sessions, status, created_at, updated_at) VALUES
(1, 4, 'Communication + JAVA FS DEVELOPER', 5, 50.00, 0.0, 0, 0, 'APPROVED', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 6, 'Core Java + Ai/ML Specialist', 5, 50.00, 0.0, 0, 0, 'APPROVED', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

-- Updated Anshul (ID 1) to be a mentor as well if needed? 
-- Actually, let's just approve him manually via Admin UI for the demo.

SELECT setval(pg_get_serial_sequence('mentors.mentor_profiles', 'id'), coalesce(max(id),0) + 1, false) FROM mentors.mentor_profiles;


-- ============================================================
-- 3. Skill Data (skillsync_skill)
-- ============================================================
\c skillsync_skill

INSERT INTO skills.skills (id, name, category, description, is_active, created_at) VALUES 
(1, 'Java', 'Backend', 'Core and advanced Java development', true, CURRENT_TIMESTAMP),
(2, 'Kotlin', 'Backend', 'Modern Kotlin application development', true, CURRENT_TIMESTAMP),
(3, 'AI/ML', 'Data Science', 'Artificial Intelligence and Machine Learning', true, CURRENT_TIMESTAMP),
(4, 'Communication', 'Soft Skills', 'Effective tech communication', true, CURRENT_TIMESTAMP),
(5, 'Full Stack', 'Architecture', 'End to end system development', true, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

SELECT setval(pg_get_serial_sequence('skills.skills', 'id'), coalesce(max(id),0) + 1, false) FROM skills.skills;


-- ============================================================
-- 4. Assign Skills back to Mentors (skillsync_user)
-- ============================================================
\c skillsync_user

INSERT INTO mentors.mentor_skills (id, mentor_id, skill_id) VALUES
(1, 1, 1),
(2, 1, 4),
(3, 1, 5),
(6, 3, 1),
(7, 3, 3)
ON CONFLICT (id) DO NOTHING;

SELECT setval(pg_get_serial_sequence('mentors.mentor_skills', 'id'), coalesce(max(id),0) + 1, false) FROM mentors.mentor_skills;
