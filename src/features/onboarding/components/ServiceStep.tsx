import React from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Trash2, Clock, DollarSign } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Logic & Store
import { ServiceSchema } from '@/domain/schemas';
import { useBusinessStore } from '@/store/businessStore';
import * as z from 'zod';

const FormSchema = z.object({
  services: z.array(ServiceSchema).min(1, 'Add at least one service')
});

interface Props {
  onNext: () => void;
}

export const ServiceStep: React.FC<Props> = ({ onNext }) => {
  const { currentBusiness, updateBusiness } = useBusinessStore();

  const { register, control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      services: currentBusiness?.services?.length 
        ? currentBusiness.services 
        : [{ name: '', duration: 30, price: 100 }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "services"
  });

  const onSubmit = (data: { services: any[] }) => {
    updateBusiness({ services: data.services, onboardingCompleted: true });
    onNext();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-gray-900">Your Services</h2>
        <p className="text-sm text-gray-500">What services do you offer to your clients?</p>
      </div>

      <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
        <AnimatePresence initial={false}>
          {fields.map((field, index) => (
            <motion.div
              key={field.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative p-4 rounded-xl border border-gray-200 bg-white shadow-sm space-y-3"
            >
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Service #{index + 1}</span>
                {fields.length > 1 && (
                  <button 
                    type="button" 
                    onClick={() => remove(index)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 gap-3">
                <input
                  {...register(`services.${index}.name`)}
                  placeholder="Service Name (e.g., Haircut)"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
                
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Clock className="absolute left-3 top-2.5 text-gray-400" size={14} />
                    <input
                      type="number"
                      {...register(`services.${index}.duration`, { valueAsNumber: true })}
                      placeholder="Min"
                      className="w-full rounded-lg border border-gray-300 pl-8 pr-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                  <div className="relative flex-1">
                    <DollarSign className="absolute left-3 top-2.5 text-gray-400" size={14} />
                    <input
                      type="number"
                      {...register(`services.${index}.price`, { valueAsNumber: true })}
                      placeholder="Price"
                      className="w-full rounded-lg border border-gray-300 pl-8 pr-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <button
        type="button"
        onClick={() => append({ name: '', duration: 30, price: 0 })}
        className="flex items-center justify-center w-full py-2 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-indigo-400 hover:text-indigo-600 transition-all text-sm font-medium"
      >
        <Plus size={16} className="mr-2" /> Add Another Service
      </button>

      <button
        type="submit"
        className="w-full rounded-lg bg-indigo-600 py-3 text-sm font-semibold text-white shadow-lg hover:bg-indigo-700 transition-all active:scale-[0.98]"
      >
        Complete Setup & Launch AI
      </button>
    </form>
  );
};

export default ServiceStep;
