# MongoDB Atlas Setup Guide

## Steps to Fix Connection:

1. Go to https://cloud.mongodb.com and login

2. Create a new FREE cluster:
   - Click "Build a Database"
   - Choose "M0 FREE" tier
   - Select a region close to you
   - Name it "couponsfeast-cluster"

3. Create Database User:
   - Go to "Database Access"
   - Add new user: `couponsadmin`
   - Password: `8PgFnv415nbwog6l`

4. Whitelist IP Address:
   - Go to "Network Access"
   - Click "Add IP Address"
   - Choose "Allow Access from Anywhere" (0.0.0.0/0)

5. Get Connection String:
   - Go to "Database" → Click "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace <password> with: 8PgFnv415nbwog6l

6. Update .env file with the new connection string

Example connection string format:
mongodb+srv://couponsadmin:8PgFnv415nbwog6l@cluster0.xxxxx.mongodb.net/couponsfeast?retryWrites=true&w=majority
