import { useOrders } from "@/hooks/use-orders";
import { useAuth } from "@/hooks/use-auth";
import { Navigation } from "@/components/Navigation";
import { Loader2, Package, Clock, CheckCircle } from "lucide-react";
import { Redirect } from "wouter";
import { format } from "date-fns";
import { motion } from "framer-motion";

export default function Orders() {
  const { user, isLoading: authLoading } = useAuth();
  const { data: orders, isLoading: ordersLoading } = useOrders();

  if (authLoading) return null;
  if (!user) return <Redirect to="/" />;

  return (
    <div className="min-h-screen bg-background pb-20">
      <Navigation />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-32">
        <h1 className="text-4xl font-display font-bold mb-2">Order History</h1>
        <p className="text-muted-foreground mb-10">Track and manage your recent purchases.</p>

        {ordersLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
        ) : !orders || orders.length === 0 ? (
          <div className="text-center py-20 bg-secondary/30 rounded-3xl border border-dashed border-border">
            <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No orders yet</h3>
            <p className="text-muted-foreground">When you make a purchase, it will appear here.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order, index) => (
              <motion.div 
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-card rounded-2xl border border-border/50 overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-border/50 gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-mono text-sm text-muted-foreground">#{order.id.toString().padStart(6, '0')}</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium flex items-center gap-1.5 
                        ${order.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                        {order.status === 'completed' ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Placed on {format(new Date(order.createdAt || Date.now()), 'MMMM d, yyyy')}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="block text-2xl font-bold font-mono">${Number(order.total).toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="p-6 bg-secondary/20">
                  <h4 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wider">Items</h4>
                  <div className="space-y-3">
                    {order.items?.map((item: any) => (
                      <div key={item.id} className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-primary/40" />
                          <span className="font-medium">
                            {item.product?.name || `Product #${item.productId}`}
                          </span>
                          <span className="text-muted-foreground">x{item.quantity}</span>
                        </div>
                        <span className="font-mono">${Number(item.price).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
