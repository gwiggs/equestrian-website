-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    user_type VARCHAR(20) NOT NULL, -- individual, business, professional
    business_name VARCHAR(100),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Listing types
CREATE TYPE listing_type AS ENUM ('horse', 'equipment', 'agistment', 'service');

-- Listings table
CREATE TABLE listings (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10, 2),
    price_type VARCHAR(20) NOT NULL, -- fixed, negotiable, weekly, etc.
    listing_type listing_type NOT NULL,
    location VARCHAR(255),
    latitude DECIMAL(9, 6),
    longitude DECIMAL(9, 6),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMP
);

-- Horse listings
CREATE TABLE horse_listings (
    listing_id UUID PRIMARY KEY REFERENCES listings(id),
    breed VARCHAR(100) NOT NULL,
    age INTEGER,
    gender VARCHAR(20) NOT NULL, -- mare, gelding, stallion
    height DECIMAL(4, 1), -- in hands
    color VARCHAR(50),
    discipline VARCHAR(100)[],
    temperament TEXT,
    training_level VARCHAR(50),
    health_records BOOLEAN,
    pedigree TEXT
);

-- Equipment listings
CREATE TABLE equipment_listings (
    listing_id UUID PRIMARY KEY REFERENCES listings(id),
    category VARCHAR(100) NOT NULL, -- saddle, bridle, trailer, etc.
    condition VARCHAR(50) NOT NULL, -- new, used, etc.
    brand VARCHAR(100),
    age INTEGER,
    size VARCHAR(50)
);

-- Agistment listings
CREATE TABLE agistment_listings (
    listing_id UUID PRIMARY KEY REFERENCES listings(id),
    property_size DECIMAL(10, 2), -- in acres/hectares
    stall_count INTEGER,
    paddock_count INTEGER,
    arena BOOLEAN,
    arena_type VARCHAR(100),
    facilities TEXT[], -- round yard, wash bay, etc.
    feed_included BOOLEAN,
    availability_date DATE
);

-- Service listings
CREATE TABLE service_listings (
    listing_id UUID PRIMARY KEY REFERENCES listings(id),
    service_type VARCHAR(100) NOT NULL, -- vet, farrier, trainer, etc.
    experience_years INTEGER,
    qualifications TEXT,
    service_area VARCHAR(255), -- geographic coverage
    availability TEXT, -- schedule info
    insurance_details TEXT
);

-- Listing images
CREATE TABLE listing_images (
    id UUID PRIMARY KEY,
    listing_id UUID NOT NULL REFERENCES listings(id),
    image_url VARCHAR(255) NOT NULL,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Messages between users
CREATE TABLE messages (
    id UUID PRIMARY KEY,
    listing_id UUID NOT NULL REFERENCES listings(id),
    sender_id UUID NOT NULL REFERENCES users(id),
    recipient_id UUID NOT NULL REFERENCES users(id),
    content TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);