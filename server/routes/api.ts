import type { Express } from 'express';
import mongoose from 'mongoose';

export function registerApiRoutes(app: Express, Order: mongoose.Model<Record<string, unknown>>): void {
  app.get('/api/health', (_req, res) => {
    const dbStatus = mongoose.connection.readyState;
    const statusMap = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting',
    };
    res.json({
      status: 'ok',
      mongodb: statusMap[dbStatus as keyof typeof statusMap] || 'unknown',
      readyState: dbStatus,
      modelName: 'Order_v2',
    });
  });

  app.get('/api/orders', async (_req, res) => {
    console.log('GET /api/orders request received');
    try {
      const orders = await Order.find().sort({ createdAt: -1 });
      console.log(`Found ${orders.length} orders`);
      res.json(orders);
    } catch (err) {
      console.error('Error fetching orders:', err);
      res.status(500).json({ error: 'Failed to fetch orders' });
    }
  });

  app.post('/api/orders', async (req, res) => {
    console.log('POST /api/orders request received', JSON.stringify(req.body, null, 2));
    try {
      const newOrder = new Order(req.body);
      await newOrder.save();
      console.log('Order saved successfully:', newOrder._id);
      res.status(201).json(newOrder);
    } catch (err: unknown) {
      console.error('Error creating order:', err);
      const e = err as { message?: string; errors?: unknown };
      res.status(400).json({
        error: 'Failed to create order',
        details: e.message,
        validationErrors: e.errors,
      });
    }
  });

  app.patch('/api/orders/:id', async (req, res) => {
    try {
      const updatedOrder = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json(updatedOrder);
    } catch {
      res.status(400).json({ error: 'Failed to update order' });
    }
  });

  app.delete('/api/orders/batch', async (req, res) => {
    try {
      const { ids } = req.body as { ids: string[] };
      await Order.deleteMany({ _id: { $in: ids } });
      res.json({ message: 'Orders deleted successfully' });
    } catch {
      res.status(400).json({ error: 'Failed to delete orders' });
    }
  });
}
