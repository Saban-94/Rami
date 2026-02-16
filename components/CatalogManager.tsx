'use client';

import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy, doc, updateDoc, deleteDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { ShoppingBag, Plus, Tag, Trash2, Edit3 } from 'lucide-react';

export default function CatalogManager({ trialId }: { trialId: string }) {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    if (!trialId) return;
    const q = query(collection(db, 'trials', trialId, 'catalog'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, [trialId]);

  const toggleSale = async (id: string, currentStatus: boolean) => {
    await updateDoc(doc(db, 'trials', trialId, 'catalog', id), { onSale: !currentStatus });
  };

  const deleteProd = async (id: string) => {
    if(confirm("למחוק מוצר זה מהקטלוג?")) await deleteDoc(doc(db, 'trials', trialId, 'catalog', id));
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white/5 border border-white/10 p-6 rounded-[2.5rem] relative group overflow-hidden">
            {product.onSale && (
              <div className="absolute top-4 left-4 bg-red-500 text-white text-[10px] font-black px-3 py-1 rounded-full animate-pulse shadow-lg">
                SALE
              </div>
            )}
            <h4 className="text-xl font-black italic mb-2 tracking-tight">{product.name}</h4>
            <div className="flex items-center gap-3 mb-4">
              <span className={`text-lg font-bold ${product.onSale ? 'line-through opacity-30' : ''}`}>₪{product.price}</span>
              {product.onSale && <span className="text-green-500 font-black text-xl italic">₪{product.salePrice}</span>}
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={() => toggleSale(product.id, product.onSale)}
                className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase transition-all border ${product.onSale ? 'bg-white text-black' : 'border-white/10 hover:bg-white/5'}`}
              >
                {product.onSale ? 'בטל מבצע' : 'הפעל מבצע'}
              </button>
              <button onClick={() => deleteProd(product.id)} className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
        
        {/* כפתור הוספה מהירה */}
        <button className="border-2 border-dashed border-white/5 rounded-[2.5rem] flex flex-col items-center justify-center p-10 opacity-30 hover:opacity-100 hover:border-green-500/50 transition-all gap-4">
          <div className="p-4 bg-white/5 rounded-full"><Plus size={32} /></div>
          <span className="font-black italic uppercase text-xs">הוסף מוצר חדש</span>
        </button>
      </div>
    </div>
  );
}
