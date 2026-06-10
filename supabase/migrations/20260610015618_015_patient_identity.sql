ALTER TABLE clinic_patients
    ADD COLUMN first_name TEXT,
    ADD COLUMN father_name TEXT,
    ADD COLUMN last_name TEXT,
    ADD COLUMN first_name_ar TEXT,
    ADD COLUMN father_name_ar TEXT,
    ADD COLUMN last_name_ar TEXT;
CREATE INDEX idx_clinic_patients_name_structure 
    ON clinic_patients(tenant_id, first_name, father_name, last_name);