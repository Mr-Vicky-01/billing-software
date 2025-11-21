'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { MenuItem } from '@/lib/types';
import {
  getMenuItems,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from '@/lib/storage';
import { useToast } from '@/context/ToastContext';

export default function ManagePage() {
  const { showToast } = useToast();
  const [items, setItems] = useState<MenuItem[]>([]);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    image: '',
    description: '',
  });
  const [imagePreview, setImagePreview] = useState<string>('');
  const [imageInputType, setImageInputType] = useState<'url' | 'upload'>('url');

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = () => {
    const menuItems = getMenuItems();
    setItems(menuItems);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.price) {
      showToast('Name and price are required!', 'error');
      return;
    }

    const price = parseFloat(formData.price);
    if (isNaN(price) || price <= 0) {
      showToast('Please enter a valid price!', 'error');
      return;
    }

    if (editingItem) {
      // Update existing item
      updateMenuItem(editingItem.id, {
        name: formData.name,
        price,
        image: formData.image,
        description: formData.description || undefined,
      });
      showToast('Item updated successfully!', 'success');
    } else {
      // Create new item
      const newItem: MenuItem = {
        id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: formData.name,
        price,
        image: formData.image,
        description: formData.description || undefined,
      };
      addMenuItem(newItem);
      showToast('Item added successfully!', 'success');
    }

    // Reset form
    setFormData({ name: '', price: '', image: '', description: '' });
    setImagePreview('');
    setImageInputType('url');
    setEditingItem(null);
    loadItems();

    // Trigger storage event for other tabs
    window.dispatchEvent(new Event('storage'));
  };

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      price: item.price.toString(),
      image: item.image,
      description: item.description || '',
    });
    setImagePreview(item.image || '');
    setImageInputType(item.image?.startsWith('data:') ? 'upload' : 'url');
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      deleteMenuItem(id);
      loadItems();
      if (editingItem?.id === id) {
        setEditingItem(null);
        setFormData({ name: '', price: '', image: '', description: '' });
      }
      showToast('Item deleted successfully!', 'success');
      window.dispatchEvent(new Event('storage'));
    }
  };

  const handleCancel = () => {
    setEditingItem(null);
    setFormData({ name: '', price: '', image: '', description: '' });
    setImagePreview('');
    setImageInputType('url');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setFormData({ ...formData, image: result });
        setImagePreview(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setFormData({ ...formData, image: url });
    setImagePreview(url);
  };

  return (
    <div className="min-h-screen bg-mesh">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 pb-24">
        <div className="mb-10 sm:mb-14 text-center">
          <div className="inline-flex items-center justify-center p-3 mb-6 bg-white/50 backdrop-blur-sm rounded-2xl shadow-glass border border-white/50 animate-fade-in">
            <div className="bg-primary-50 p-2 rounded-xl">
              <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </div>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-primary-800 to-slate-900 animate-gradient">
              Manage Inventory
            </span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Add, edit, or remove items from your product catalog
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
          {/* Form Section */}
          <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/50 shadow-glass-lg animate-fade-in h-fit sticky top-24">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-800">
                {editingItem ? 'Edit Item' : 'Add New Item'}
              </h2>
              {editingItem && (
                <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-semibold uppercase tracking-wide">
                  Editing Mode
                </span>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Item Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 shadow-sm focus:shadow-md"
                  placeholder="e.g. Premium Cricket Bat"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Price (₹) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">₹</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    className="w-full pl-8 pr-4 py-3 bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 shadow-sm focus:shadow-md"
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Item Image
                </label>

                {/* Toggle between URL and Upload */}
                <div className="flex gap-2 mb-4 bg-slate-100/80 p-1.5 rounded-xl">
                  <button
                    type="button"
                    onClick={() => {
                      setImageInputType('url');
                      if (!formData.image.startsWith('data:')) {
                        setImagePreview(formData.image);
                      } else {
                        setFormData({ ...formData, image: '' });
                        setImagePreview('');
                      }
                    }}
                    className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-all ${imageInputType === 'url'
                        ? 'bg-white text-primary-600 shadow-sm'
                        : 'text-slate-500 hover:text-slate-700'
                      }`}
                  >
                    Image URL
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setImageInputType('upload');
                      if (formData.image.startsWith('data:')) {
                        setImagePreview(formData.image);
                      } else {
                        setFormData({ ...formData, image: '' });
                        setImagePreview('');
                      }
                    }}
                    className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-all ${imageInputType === 'upload'
                        ? 'bg-white text-primary-600 shadow-sm'
                        : 'text-slate-500 hover:text-slate-700'
                      }`}
                  >
                    Upload Image
                  </button>
                </div>

                {/* URL Input */}
                {imageInputType === 'url' && (
                  <input
                    type="url"
                    value={formData.image.startsWith('data:') ? '' : formData.image}
                    onChange={handleImageUrlChange}
                    className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 shadow-sm"
                    placeholder="https://example.com/image.jpg"
                  />
                )}

                {/* Upload Input */}
                {imageInputType === 'upload' && (
                  <div className="space-y-2">
                    <label
                      htmlFor="image-upload"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-300 border-dashed rounded-xl cursor-pointer bg-slate-50/50 hover:bg-slate-100/50 hover:border-primary-400 transition-all duration-200 group"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <div className="p-3 bg-white rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform duration-200">
                          <svg className="w-6 h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                        </div>
                        <p className="mb-1 text-sm font-medium text-slate-600">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-xs text-slate-400">PNG, JPG, GIF up to 5MB</p>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                      />
                    </label>
                  </div>
                )}

                {/* Image Preview */}
                {imagePreview && (
                  <div className="mt-4 p-3 bg-white rounded-xl border border-slate-100 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Preview</span>
                      <button
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, image: '' });
                          setImagePreview('');
                        }}
                        className="text-red-500 hover:text-red-600 text-xs font-medium hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="relative w-full h-48 rounded-lg overflow-hidden bg-slate-100">
                      <Image
                        src={imagePreview}
                        alt="Preview"
                        fill
                        className="object-cover"
                        onError={() => setImagePreview('')}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 shadow-sm"
                  rows={3}
                  placeholder="Enter item description..."
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-bold py-3.5 px-6 rounded-xl transition-all duration-200 shadow-lg shadow-primary-500/30 hover:shadow-primary-500/40 hover:-translate-y-0.5 active:translate-y-0"
                >
                  {editingItem ? 'Update Item' : 'Add Item'}
                </button>
                {editingItem && (
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-6 py-3.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 hover:text-slate-900 transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Items List Section */}
          <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/50 shadow-glass-lg flex flex-col h-[800px]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-800">Inventory Items</h2>
              <span className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-xs font-bold">
                {items.length} Items
              </span>
            </div>

            {items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 00.586 13H4" />
                  </svg>
                </div>
                <p className="text-slate-500 font-medium">No items in the menu yet.</p>
                <p className="text-slate-400 text-sm mt-1">Add your first item using the form.</p>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="group bg-white/60 hover:bg-white border border-white/60 hover:border-primary-200 rounded-2xl p-3 transition-all duration-200 hover:shadow-md flex gap-4"
                  >
                    <div className="relative w-20 h-20 bg-slate-100 rounded-xl overflow-hidden flex-shrink-0 border border-slate-100">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/placeholder.png';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-slate-50">
                          <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>

                    <div className="flex-grow min-w-0 flex flex-col justify-center">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-bold text-slate-800 truncate pr-2">{item.name}</h3>
                        <span className="font-bold text-primary-600 bg-primary-50 px-2 py-0.5 rounded-lg text-sm">
                          ₹{item.price.toFixed(2)}
                        </span>
                      </div>

                      {item.description && (
                        <p className="text-sm text-slate-500 line-clamp-1 mb-2">{item.description}</p>
                      )}

                      <div className="flex gap-2 mt-auto">
                        <button
                          onClick={() => handleEdit(item)}
                          className="flex-1 bg-white border border-slate-200 hover:border-blue-300 hover:bg-blue-50 text-slate-600 hover:text-blue-600 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="flex-1 bg-white border border-slate-200 hover:border-red-300 hover:bg-red-50 text-slate-600 hover:text-red-600 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
