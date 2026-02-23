import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { BusinessIdentitySchema } from '@/domain/schemas';
import { useBusinessStore } from '@/store/businessStore';

interface Props {
  onNext: () => void;
}

const industries = [
  'Barber Shop', 'Beauty Salon', 'Medical Clinic', 'Law Firm', 'Consulting', 'Fitness & Personal Training', 'Other'
];

export const IdentityStep: React.FC<Props> = ({ onNext }) => {
  const { currentBusiness, updateBusiness } = useBusinessStore();
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(BusinessIdentitySchema),
    defaultValues: {
      name: currentBusiness?.name || '',
      industry: currentBusiness?.industry || ''
    }
  });

  const onSubmit = (data: { name: string; industry: string }) => {
    updateBusiness(data);
    onNext();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-gray-900">Let's start with the basics</h2>
        <p className="text-sm text-gray-500">Tell us about your business</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Business Name</label>
          <input
            {...register('name')}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="e.g. Bloom Hair Studio"
          />
          {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message as string}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Industry</label>
          <select
            {...register('industry')}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">Select industry...</option>
            {industries.map(i => <option key={i} value={i}>{i}</option>)}
          </select>
          {errors.industry && <p className="mt-1 text-xs text-red-500">{errors.industry.message as string}</p>}
        </div>
      </div>

      <button
        type="submit"
        className="w-full rounded-lg bg-indigo-600 py-3 text-sm font-semibold text-white shadow-md hover:bg-indigo-700 transition-all"
      >
        Continue
      </button>
    </form>
  );
};

export default IdentityStep;
