import { Link } from "wouter";
import type { Product } from "@shared/schema";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Plus, ShoppingBag } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

export function ProductCard({ product }: { product: Product }) {
  const addItem = useCart((state) => state.addItem);
  const { toast } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product);
    toast({
      title: "Added to cart",
      description: `${product.name} is now in your cart.`,
      duration: 2000,
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="group relative bg-card rounded-2xl overflow-hidden border border-border/50 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
    >
      <Link href={`/products/${product.id}`} className="block">
        <div className="aspect-[4/3] overflow-hidden bg-muted relative">
          <img 
            src={product.imageUrl} 
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          <Button
            size="icon"
            className="absolute bottom-4 right-4 rounded-full shadow-lg translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 bg-white text-black hover:bg-white/90 hover:scale-110"
            onClick={handleAddToCart}
          >
            <Plus className="w-5 h-5" />
          </Button>
        </div>
        
        <div className="p-5">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-display font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
              {product.name}
            </h3>
            <span className="font-bold text-lg text-foreground font-mono bg-secondary/50 px-2 py-1 rounded-md text-sm">
              ${Number(product.price).toFixed(2)}
            </span>
          </div>
          <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}
