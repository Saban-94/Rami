import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Truck, Package, User, MapPin, CheckCircle } from 'lucide-react';

const OrderManagerInterface = ({ orders }) => {
  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen font-sans">
      <header className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm">
        <h1 className="text-2xl font-bold text-gray-800">SabanOS - ניהול סידור בוקר</h1>
        <div className="flex gap-4">
          <Badge variant="outline" className="text-blue-600">פעילים: {orders.filter(o => o.status === 'בדרך').length}</Badge>
          <Badge variant="outline" className="text-green-600">סופקו: {orders.filter(o => o.status === 'סופקה (✅)').length}</Badge>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {orders.map((order, idx) => (
          <Card key={idx} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">הזמנה #{order.orderId}</CardTitle>
              <Badge className={order.status === 'סופקה (✅)' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}>
                {order.status}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-semibold">{order.driver}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">{order.customer}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">{order.destination}</span>
                </div>
                {order.trackingLink && (
                  <a href={order.trackingLink} className="text-xs text-blue-500 underline block mt-2">
                    עקוב ב-Waze
                  </a>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default OrderManagerInterface;
