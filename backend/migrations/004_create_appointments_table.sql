-- Create appointments table with comprehensive schema
CREATE TABLE IF NOT EXISTS appointments (
    -- Primary Key
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Appointment Details
    title VARCHAR(255) NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    time TIME NOT NULL,
    
    -- Relationships
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
    broker_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Classification
    type VARCHAR(50) NOT NULL CHECK (type IN ('site_visit', 'meeting', 'call')),
    status VARCHAR(50) NOT NULL DEFAULT 'scheduled' 
        CHECK (status IN ('scheduled', 'completed', 'cancelled')),
    
    -- Denormalized fields for performance
    client_name VARCHAR(200),
    client_phone VARCHAR(20),
    property_address TEXT,
    broker_name VARCHAR(200),
    broker_city VARCHAR(100),
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Performance Indexes

-- Primary query pattern: broker's appointments ordered by date/time
CREATE INDEX IF NOT EXISTS idx_appointments_broker_datetime 
    ON appointments(broker_id, date ASC, time ASC);

-- Filter by status
CREATE INDEX IF NOT EXISTS idx_appointments_broker_status 
    ON appointments(broker_id, status);

-- Filter by type
CREATE INDEX IF NOT EXISTS idx_appointments_broker_type 
    ON appointments(broker_id, type);

-- Filter by client
CREATE INDEX IF NOT EXISTS idx_appointments_client 
    ON appointments(client_id);

-- Filter by property (partial index for non-null values)
CREATE INDEX IF NOT EXISTS idx_appointments_property 
    ON appointments(property_id) WHERE property_id IS NOT NULL;

-- Date range queries for calendar
CREATE INDEX IF NOT EXISTS idx_appointments_broker_date_range 
    ON appointments(broker_id, date);

-- Trigger to automatically update updated_at timestamp
CREATE TRIGGER update_appointments_updated_at 
    BEFORE UPDATE ON appointments 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Function to populate client info on appointment insert
CREATE OR REPLACE FUNCTION populate_appointment_client_info()
RETURNS TRIGGER AS $
BEGIN
    -- Automatically populate client_name and client_phone from clients table
    SELECT 
        first_name || ' ' || last_name,
        phone
    INTO 
        NEW.client_name,
        NEW.client_phone
    FROM clients
    WHERE id = NEW.client_id;
    
    RETURN NEW;
END;
$ LANGUAGE plpgsql;

-- Trigger to populate client info on insert
CREATE TRIGGER populate_appointment_client_info_on_insert
    BEFORE INSERT ON appointments
    FOR EACH ROW
    EXECUTE FUNCTION populate_appointment_client_info();

-- Function to populate property info on appointment insert
CREATE OR REPLACE FUNCTION populate_appointment_property_info()
RETURNS TRIGGER AS $
BEGIN
    -- Automatically populate property_address from properties table if property_id is provided
    IF NEW.property_id IS NOT NULL THEN
        SELECT address
        INTO NEW.property_address
        FROM properties
        WHERE id = NEW.property_id;
    END IF;
    
    RETURN NEW;
END;
$ LANGUAGE plpgsql;

-- Trigger to populate property info on insert
CREATE TRIGGER populate_appointment_property_info_on_insert
    BEFORE INSERT ON appointments
    FOR EACH ROW
    EXECUTE FUNCTION populate_appointment_property_info();

-- Function to populate broker info on appointment insert
CREATE OR REPLACE FUNCTION populate_appointment_broker_info()
RETURNS TRIGGER AS $
BEGIN
    -- Automatically populate broker_name and broker_city from users table
    SELECT 
        first_name || ' ' || last_name,
        city
    INTO 
        NEW.broker_name,
        NEW.broker_city
    FROM users
    WHERE id = NEW.broker_id;
    
    RETURN NEW;
END;
$ LANGUAGE plpgsql;

-- Trigger to populate broker info on insert
CREATE TRIGGER populate_appointment_broker_info_on_insert
    BEFORE INSERT ON appointments
    FOR EACH ROW
    EXECUTE FUNCTION populate_appointment_broker_info();

-- Function to sync client info when client is updated
CREATE OR REPLACE FUNCTION sync_client_info_to_appointments()
RETURNS TRIGGER AS $
BEGIN
    -- Update all appointments for this client when their name or phone changes
    UPDATE appointments
    SET 
        client_name = NEW.first_name || ' ' || NEW.last_name,
        client_phone = NEW.phone,
        updated_at = NOW()
    WHERE client_id = NEW.id;
    
    RETURN NEW;
END;
$ LANGUAGE plpgsql;

-- Trigger to sync client info when client profile changes
CREATE TRIGGER sync_client_info_to_appointments_trigger
    AFTER UPDATE OF first_name, last_name, phone ON clients
    FOR EACH ROW
    EXECUTE FUNCTION sync_client_info_to_appointments();

-- Function to sync property info when property is updated
CREATE OR REPLACE FUNCTION sync_property_info_to_appointments()
RETURNS TRIGGER AS $
BEGIN
    -- Update all appointments for this property when address changes
    UPDATE appointments
    SET 
        property_address = NEW.address,
        updated_at = NOW()
    WHERE property_id = NEW.id;
    
    RETURN NEW;
END;
$ LANGUAGE plpgsql;

-- Trigger to sync property info when property address changes
CREATE TRIGGER sync_property_info_to_appointments_trigger
    AFTER UPDATE OF address ON properties
    FOR EACH ROW
    EXECUTE FUNCTION sync_property_info_to_appointments();

-- Function to sync broker info to appointments when user is updated
CREATE OR REPLACE FUNCTION sync_broker_info_to_appointments()
RETURNS TRIGGER AS $
BEGIN
    -- Update all appointments for this broker when their name or city changes
    UPDATE appointments
    SET 
        broker_name = NEW.first_name || ' ' || NEW.last_name,
        broker_city = NEW.city,
        updated_at = NOW()
    WHERE broker_id = NEW.id;
    
    RETURN NEW;
END;
$ LANGUAGE plpgsql;

-- Trigger to sync broker info when user profile changes
CREATE TRIGGER sync_broker_info_to_appointments_trigger
    AFTER UPDATE OF first_name, last_name, city ON users
    FOR EACH ROW
    EXECUTE FUNCTION sync_broker_info_to_appointments();
