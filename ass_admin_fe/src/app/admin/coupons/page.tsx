'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/AdminLayout';
import withAuth from '@/utils/withAuth';
import { getCoupons, toggleCouponStatus, deleteCoupon } from '@/services/coupons';

function CouponsPage() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const data = await getCoupons();
      setCoupons(data.coupons || []);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch coupons');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      setActionInProgress(id);
      await toggleCouponStatus(id);
  
      setCoupons(coupons.map(coupon => 
        coupon._id === id 
          ? { ...coupon, isActive: !coupon.isActive }
          : coupon
      ));
      
    } catch (err: any) {
      setError(err.message || 'Failed to toggle coupon status');
    } finally {
      setActionInProgress(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this coupon?')) return;
    
    try {
      setActionInProgress(id);
      await deleteCoupon(id);
     
      setCoupons(coupons.filter(coupon => coupon._id !== id));
      
    } catch (err: any) {
      setError(err.message || 'Failed to delete coupon');
    } finally {
      setActionInProgress(null);
    }
  };

  return (
    <AdminLayout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Coupons</h1>
          <p className="text-gray-600">Manage your coupon inventory</p>
        </div>
        <Link
          href="/admin/coupons/add"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Add New Coupon
        </Link>
      </div>

      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-4 text-red-700">
          <p>{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
        </div>
      ) : coupons.length === 0 ? (
        <div className="rounded-lg bg-white p-6 text-center shadow">
          <p className="text-gray-500">No coupons found</p>
          <Link 
            href="/admin/coupons/add"
            className="mt-2 inline-block text-blue-600 hover:text-blue-800"
          >
            Create your first coupon
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Code
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Description
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Expiry
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {coupons.map((coupon) => (
                  <tr key={coupon._id}>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="font-medium text-gray-900">{coupon.code}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500">{coupon.description}</div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                          coupon.isUsed
                            ? 'bg-gray-100 text-gray-800'
                            : coupon.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {coupon.isUsed
                          ? 'Used'
                          : coupon.isActive
                          ? 'Active'
                          : 'Inactive'}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {coupon.expiresAt
                        ? new Date(coupon.expiresAt).toLocaleDateString()
                        : 'No expiry'}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      <div className="flex space-x-2">
                        {!coupon.isUsed && (
                          <button
                            onClick={() => handleToggleStatus(coupon._id)}
                            disabled={actionInProgress === coupon._id}
                            className={`rounded px-2 py-1 text-xs font-medium ${
                              coupon.isActive
                                ? 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100'
                                : 'bg-green-50 text-green-700 hover:bg-green-100'
                            }`}
                          >
                            {actionInProgress === coupon._id ? (
                              <span className="inline-block h-3 w-3 animate-pulse rounded-full bg-current"></span>
                            ) : coupon.isActive ? (
                              'Deactivate'
                            ) : (
                              'Activate'
                            )}
                          </button>
                        )}
                        
                        {!coupon.isUsed && (
                          <button
                            onClick={() => handleDelete(coupon._id)}
                            disabled={actionInProgress === coupon._id}
                            className="rounded bg-red-50 px-2 py-1 text-xs font-medium text-red-700 hover:bg-red-100"
                          >
                            {actionInProgress === coupon._id ? (
                              <span className="inline-block h-3 w-3 animate-pulse rounded-full bg-current"></span>
                            ) : (
                              'Delete'
                            )}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

export default withAuth(CouponsPage);