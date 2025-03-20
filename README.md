# Patriotic Keys App (PKA)

## Overview

Patriotic Keys App (PKA) is a locksmith and vehicle owner mobile app designed to streamline key inventory management, invoicing, and VIN-based vehicle lookup. Built with FastAPI for the backend and React Native for the frontend, PKA enables locksmiths to efficiently manage their business while providing seamless access for vehicle owners.

## Key Features

1. User Management  
   - Locksmiths and vehicle owners can sign up and manage accounts.  
   - Locksmiths require credential verification before account activation.  
   - Admins oversee all users.  

2. VIN-Based Vehicle Lookup  
   - Locksmiths scan Vehicle Identification Numbers (VINs) to retrieve vehicle details.  
   - Integrates with the NHTSA Vehicle API for automatic data population.  

3. Key Inventory Management  
   - Locksmiths can view available inventory before use.  
   - Stock updates automatically when a key is used or added.  
   - Minimum stock threshold (default: 10) triggers a manual reorder.  

4. Invoicing System  
   - Auto-generates invoices when a locksmith starts a job.  
   - Locksmiths can review, edit, and approve invoices before sending.  
   - Invoice details sync with desktop accounting software.  

5. Receipt Scanning  
   - Locksmiths can upload receipts to update inventory.  
   - Supports barcode scanning for faster processing.  

6. Security and Authentication  
   - Uses JWT authentication for secure user access.  
   - Locksmiths and vehicle owners have different access roles.  

## Technology Stack

- FastAPI for backend  
- React Native for frontend  
- PostgreSQL for database  
- NHTSA API integration for vehicle data  
- Cloud storage for receipt management  

## Installation

### Backend Setup  

1. Clone the repository:  
```sh
git clone https://github.com/yourusername/patriotic-keys.git
cd patriotic-keys/backend
```

2. Create a virtual environment and activate it:  
```sh
python -m venv env
source .venv/bin/activate
```

3. Install dependencies:  
```sh
pip install -r requirements.txt
```

4. Set up environment variables in a `.env` file:  
```
DATABASE_URL=postgresql://user:password@localhost/pka
SECRET_KEY=your_secret_key
```

5. Run the application:  
```sh
uvicorn app.main:app --reload
```

### Frontend Setup  

1. Navigate to the frontend directory:  
```sh
cd ../frontend
```

2. Install dependencies:  
```sh
npm install
```

3. Start the application:  
```sh
npm start
```

## Contributing  

1. Fork the repository  
2. Create a new branch:  
```sh
git checkout -b feature-name
```
3. Commit your changes:  
```sh
git commit -m "Added a new feature"
```
4. Push the branch and open a pull request  

## License  

This project is licensed under the MIT License. See the LICENSE file for details.