'use client';

import { useState, useEffect } from 'react';
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
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-8 text-center">Manage Menu</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
        {/* Form Section */}
        <div className="bg-white rounded-2xl shadow-modern-lg border border-gray-200/50 p-5 sm:p-6 animate-fade-in">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-5 text-gray-800">
            {editingItem ? 'Edit Item' : 'Add New Item'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Item Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm focus:shadow-modern"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm focus:shadow-modern"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Item Image
              </label>
              
              {/* Toggle between URL and Upload */}
              <div className="flex gap-2 mb-3 bg-gray-100 p-1 rounded-lg">
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
                  className={`flex-1 py-1.5 px-3 rounded-md text-sm font-medium transition-all ${
                    imageInputType === 'url'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
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
                  className={`flex-1 py-1.5 px-3 rounded-md text-sm font-medium transition-all ${
                    imageInputType === 'upload'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://example.com/image.jpg"
                />
              )}

              {/* Upload Input */}
              {imageInputType === 'upload' && (
                <div className="space-y-2">
                  <label
                    htmlFor="image-upload"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
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
                <div className="mt-3">
                  <p className="text-xs text-gray-500 mb-2">Preview:</p>
                  <div className="relative w-full h-48 border border-gray-200 rounded-lg overflow-hidden bg-gray-100">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={() => setImagePreview('')}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setFormData({ ...formData, image: '' });
                        setImagePreview('');
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors shadow-lg"
                      title="Remove image"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={3}
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-2.5 px-5 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
              >
                {editingItem ? 'Update Item' : 'Add Item'}
              </button>
              {editingItem && (
                <button
                  type="button"
                  onClick={handleCancel}
                  className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2.5 px-5 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Items List Section */}
        <div className="bg-white rounded-xl shadow-professional-lg border border-gray-200 p-5 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-5 text-gray-800">Menu Items</h2>
          {items.length === 0 ? (
            <p className="text-gray-500 text-sm sm:text-base">No items in the menu yet.</p>
          ) : (
            <div className="space-y-2 sm:space-y-3 max-h-[600px] overflow-y-auto">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="border border-gray-200 rounded-lg p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3 sm:gap-4 flex-grow w-full sm:w-auto">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-200 rounded flex-shrink-0">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover rounded"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/placeholder.png';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-gray-400 text-xs">No Image</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-grow min-w-0">
                      <h3 className="font-semibold text-base sm:text-lg truncate">{item.name}</h3>
                      <p className="text-gray-600 text-sm sm:text-base">₹{item.price.toFixed(2)}</p>
                      {item.description && (
                        <p className="text-xs sm:text-sm text-gray-500 line-clamp-1">{item.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto justify-end sm:justify-start">
                    <button
                      onClick={() => handleEdit(item)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium shadow-sm hover:shadow transition-all flex-1 sm:flex-none"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium shadow-sm hover:shadow transition-all flex-1 sm:flex-none"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
