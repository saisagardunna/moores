require('dotenv').config();
const { MongoClient, ObjectId } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb+srv://moores_icecream:Saisagar123@cluster0.usdcgoa.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const dbName = 'moores_icecream';

async function populateData() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db(dbName);

    // Clear existing data
    await db.collection('clients').deleteMany({});
    await db.collection('orders').deleteMany({});
    await db.collection('payments').deleteMany({});
    console.log('🧹 Cleared existing data');

    // Create 2 clients
    const client1 = await db.collection('clients').insertOne({
      name: 'Test Client 1',
      phone: '1234567890',
      stallName: 'Stall 1',
      email: 'client1@example.com',
      totalOwed: 500,
      schedule: 'Weekly Mon/Wed',
      deadline: new Date('2025-09-20'),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const client2 = await db.collection('clients').insertOne({
      name: 'Test Client 2',
      phone: '0987654321',
      stallName: 'Stall 2',
      email: 'client2@example.com',
      totalOwed: 0,
      schedule: 'Daily',
      deadline: new Date('2025-10-01'),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const client1Id = client1.insertedId;
    const client2Id = client2.insertedId;

    console.log('👥 Created clients:', client1Id.toString(), client2Id.toString());

    // Create orders for client1
    const order1 = await db.collection('orders').insertOne({
      clientId: client1Id,
      clientName: 'Test Client 1',
      clientPhone: '1234567890',
      stallName: 'Stall 1',
      iceCreams: [{ name: 'Vanilla', category: 'Classic', quantity: 10 }],
      totalAmount: 1000,
      orderDate: new Date('2025-09-01'),
      paymentStatus: 'completed',
      inquiryType: 'Delivery',
      message: 'Test order 1',
      status: 'delivered',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const order2 = await db.collection('orders').insertOne({
      clientId: client1Id,
      clientName: 'Test Client 1',
      clientPhone: '1234567890',
      stallName: 'Stall 1',
      iceCreams: [{ name: 'Chocolate', category: 'Classic', quantity: 5 }],
      totalAmount: 500,
      orderDate: new Date('2025-09-10'),
      paymentStatus: 'pending',
      inquiryType: 'Delivery',
      message: 'Test order 2',
      status: 'confirmed',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Create order for client2
    const order3 = await db.collection('orders').insertOne({
      clientId: client2Id,
      clientName: 'Test Client 2',
      clientPhone: '0987654321',
      stallName: 'Stall 2',
      iceCreams: [{ name: 'Strawberry', category: 'Fruit', quantity: 8 }],
      totalAmount: 800,
      orderDate: new Date('2025-09-05'),
      paymentStatus: 'completed',
      inquiryType: 'Pickup',
      message: 'Test order 3',
      status: 'delivered',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    console.log('🍦 Created orders');

    // Create payments
    await db.collection('payments').insertOne({
      orderId: order1.insertedId,
      clientId: client1Id,
      amount: 1000,
      status: 'completed',
      deadline: new Date('2025-09-08'),
      remindersSent: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await db.collection('payments').insertOne({
      orderId: order2.insertedId,
      clientId: client1Id,
      amount: 500,
      status: 'pending',
      deadline: new Date('2025-09-17'),
      remindersSent: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    console.log('💰 Payments created successfully!');
    console.log('✅ Data population completed. Refresh your admin panel.');
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
    console.log('🔒 Connection closed');
  }
}

populateData();
