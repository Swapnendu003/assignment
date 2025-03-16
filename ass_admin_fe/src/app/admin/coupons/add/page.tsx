
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';
import withAuth from '@/utils/withAuth';
import { createCoupon, createCouponsBulk } from '@/services/coupons';

function AddCouponPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('single');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [singleForm, setSingleForm] = useState({
    code: '',
    description: '',
    expiresAt: ''
  });

  const [bulkForm, setBulkForm] = useState({
    coupons: '',
    description: ''
  });

  const handleSingleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSingleForm({ ...singleForm, [name]: value });
  };

  const handleBulkFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBulkForm({ ...bulkForm, [name]: value });
  };

  const handleSingleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await createCoupon({
        code: singleForm.code,
        description: singleForm.description,
        expiresAt: singleForm.expiresAt || undefined
      });

      setSuccess('Coupon created successfully!');
      setSingleForm({ code: '', description: '', expiresAt: '' });
      setTimeout(() => {
        router.push('/admin/coupons');
      }, 1000);
      
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create coupon');
    } finally {
      setLoading(false);
    }
  };

  const handleBulkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const codes = bulkForm.coupons
        .split('\n')
        .map(code => code.trim())
        .filter(code => code);

      if (codes.length === 0) {
        throw new Error('Please enter at least one coupon code');
      }
      const couponsData = codes.map(code => ({
        code,
        description: bulkForm.description
      }));

      await createCouponsBulk({ coupons: couponsData });

      setSuccess(`${codes.length} coupons created successfully!`);
      setBulkForm({ coupons: '', description: '' });
      setTimeout(() => {
        router.push('/admin/coupons');
      }, 1000);
      
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create coupons');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add Coupon</h1>
          <p className="text-gray-600">Create new coupons for your users</p>
        </div>
        <button
          onClick={() => router.push('/admin/coupons')}
          className="flex items-center rounded-md bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-gray-300 hover:bg-gray-50"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Coupons
        </button>
      </div>

      {error && (
        <div className="mb-4 flex items-center rounded-md bg-red-50 p-4 text-red-700">
          <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <p>{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-4 flex items-center rounded-md bg-green-50 p-4 text-green-700">
          <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <p>{success}</p>
        </div>
      )}

      <div className="overflow-hidden rounded-lg bg-white shadow">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('single')}
              className={`w-1/2 border-b-2 py-4 px-1 text-center text-sm font-medium transition-colors ${
                activeTab === 'single'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`}
            >
              <div className="flex justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 6a2 2 0 012-2h5a2 2 0 012 2v1a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14 6a1 1 0 00-1 1v8a1 1 0 001 1h4a1 1 0 001-1V7a1 1 0 00-1-1h-4z" />
                </svg>
                Single Coupon
              </div>
            </button>
            <button
              onClick={() => setActiveTab('bulk')}
              className={`w-1/2 border-b-2 py-4 px-1 text-center text-sm font-medium transition-colors ${
                activeTab === 'bulk'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`}
            >
              <div className="flex justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                </svg>
                Bulk Create
              </div>
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'single' ? (
            <form onSubmit={handleSingleSubmit} className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-md mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3 flex-1 md:flex md:justify-between">
                    <p className="text-sm text-blue-700">
                      Create a single coupon with a unique code that users can claim.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label htmlFor="code" className="block text-sm font-medium text-gray-700">
                    Coupon Code <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2 6a2 2 0 012-2h5a2 2 0 012 2v1a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14 6a1 1 0 00-1 1v8a1 1 0 001 1h4a1 1 0 001-1V7a1 1 0 00-1-1h-4z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      id="code"
                      name="code"
                      value={singleForm.code}
                      onChange={handleSingleFormChange}
                      required
                      className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm h-8"
                      placeholder="e.g. SUMMER2023"
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Enter a unique code for this coupon. This is what users will claim.
                  </p>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="expiresAt" className="block text-sm font-medium text-gray-700">
                    Expiry Date (Optional)
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <input
                      type="date"
                      id="expiresAt"
                      name="expiresAt"
                      value={singleForm.expiresAt}
                      onChange={handleSingleFormChange}
                      className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm h-8"
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Leave blank if the coupon doesn't expire.
                  </p>
                </div>

                <div className="sm:col-span-6">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="description"
                      name="description"
                      value={singleForm.description}
                      onChange={handleSingleFormChange}
                      required
                      rows={3}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm pl-4"
                      placeholder="Description of the coupon and what it offers"
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Provide a clear description of what this coupon offers to users.
                  </p>
                </div>
              </div>

              <div className="flex justify-end space-x-3 border-t pt-6">
                <button
                  type="button"
                  onClick={() => router.push('/admin/coupons')}
                  className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {loading && (
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  )}
                  {loading ? 'Creating...' : 'Create Coupon'}
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleBulkSubmit} className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-md mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3 flex-1 md:flex md:justify-between">
                    <p className="text-sm text-blue-700">
                      Create multiple coupons at once. Enter one coupon code per line.
                      All coupons will share the same description.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label htmlFor="coupons" className="block text-sm font-medium text-gray-700">
                    Coupon Codes <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="coupons"
                      name="coupons"
                      value={bulkForm.coupons}
                      onChange={handleBulkFormChange}
                      required
                      rows={6}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm font-mono"
                      placeholder="SUMMER2023-1&#10;SUMMER2023-2&#10;SUMMER2023-3"
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Enter one coupon code per line. Each code must be unique.
                  </p>
                </div>

                <div>
                  <label htmlFor="bulk-description" className="block text-sm font-medium text-gray-700">
                    Common Description <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="bulk-description"
                      name="description"
                      value={bulkForm.description}
                      onChange={handleBulkFormChange}
                      required
                      rows={3}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      placeholder="Common description for all coupons"
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    This description will be applied to all coupons created in this batch.
                  </p>
                </div>
              </div>

              <div className="flex justify-end space-x-3 border-t pt-6">
                <button
                  type="button"
                  onClick={() => router.push('/admin/coupons')}
                  className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {loading && (
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  )}
                  {loading ? 'Creating...' : 'Create Coupons'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

export default withAuth(AddCouponPage);