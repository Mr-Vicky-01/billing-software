'use client';

import { useState } from 'react';
import Image from 'next/image';
import { MenuItem } from '@/lib/types';
import { addMenuItem, updateMenuItem, deleteMenuItem } from '@/lib/api';
import { useToast } from '@/context/ToastContext';

interface ManageClientProps {
    initialItems: MenuItem[];
}

export default function ManageClient({ initialItems }: ManageClientProps) {
    const { showToast } = useToast();
    const [items, setItems] = useState<MenuItem[]>(initialItems);
    const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        image: '',
        description: '',
    });
    const [imagePreview, setImagePreview] = useState<string>('');
    const [imageInputType, setImageInputType] = useState<'url' | 'upload'>('url');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const loadItems = async () => {
        try {
            const response = await fetch('/api/menu-items');
            const menuItems = await response.json();
            setItems(menuItems);
        } catch (error) {
            showToast('Failed to load items', 'error');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
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

        setIsSubmitting(true);

        try {
            if (editingItem) {
                await updateMenuItem(editingItem.id, {
                    name: formData.name,
                    price,
                    image: formData.image,
                    description: formData.description || undefined,
                });
                showToast('Item updated successfully!', 'success');
            } else {
                const newItem: MenuItem = {
                    id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                    name: formData.name,
                    price,
                    image: formData.image,
                    description: formData.description || undefined,
                };
                await addMenuItem(newItem);
                showToast('Item added successfully!', 'success');
            }

            setFormData({ name: '', price: '', image: '', description: '' });
            setImagePreview('');
            setImageInputType('url');
            setEditingItem(null);
            await loadItems();
        } catch (error) {
            showToast('Failed to save item', 'error');
        } finally {
            setIsSubmitting(false);
        }
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

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this item?')) {
            try {
                await deleteMenuItem(id);
                await loadItems();
                if (editingItem?.id === id) {
                    setEditingItem(null);
                    setFormData({ name: '', price: '', image: '', description: '' });
                }
                showToast('Item deleted successfully!', 'success');
            } catch (error) {
                showToast('Failed to delete item', 'error');
            }
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
            if (!file.type.startsWith('image/')) {
                alert('Please select a valid image file');
                return;
            }

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
        <div className="min-h-screen bg-dark-mesh">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 pb-24">
                {/* Page Header */}
                <div className="mb-10 sm:mb-14 text-center">
                    <div className="inline-flex items-center justify-center p-3 mb-6 bg-dark-200/60 backdrop-blur-sm rounded-2xl shadow-dark border border-dark-50/30 animate-reveal-up">
                        <div className="bg-accent/10 p-2 rounded-xl">
                            <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                            </svg>
                        </div>
                    </div>

                    <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-4 animate-reveal-up stagger-1">
                        <span className="text-gold-gradient">
                            Manage Inventory
                        </span>
                    </h1>
                    <p className="text-lg text-ivory-muted max-w-2xl mx-auto animate-reveal-up stagger-2">
                        Add, edit, or remove items from your product catalog
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
                    {/* Form Section */}
                    <div className="dark-card-static rounded-3xl p-6 sm:p-8 shadow-dark-lg animate-reveal-up stagger-3 h-fit sticky top-24">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-ivory">
                                {editingItem ? 'Edit Item' : 'Add New Item'}
                            </h2>
                            {editingItem && (
                                <span className="px-3 py-1 bg-accent/15 text-accent rounded-full text-xs font-semibold uppercase tracking-wide border border-accent/20">
                                    Editing Mode
                                </span>
                            )}
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-ivory-muted mb-2">
                                    Item Name <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) =>
                                        setFormData({ ...formData, name: e.target.value })
                                    }
                                    className="w-full px-4 py-3 input-dark rounded-xl"
                                    placeholder="e.g. Premium Cricket Bat"
                                    required
                                    disabled={isSubmitting}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-ivory-muted mb-2">
                                    Price (₹) <span className="text-red-400">*</span>
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-ivory-dim font-medium">₹</span>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={formData.price}
                                        onChange={(e) =>
                                            setFormData({ ...formData, price: e.target.value })
                                        }
                                        className="w-full pl-8 pr-4 py-3 input-dark rounded-xl"
                                        placeholder="0.00"
                                        required
                                        disabled={isSubmitting}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-ivory-muted mb-3">
                                    Item Image
                                </label>

                                {/* Toggle between URL and Upload */}
                                <div className="flex gap-2 mb-4 bg-dark-300 p-1.5 rounded-xl">
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
                                            ? 'bg-dark-50 text-accent shadow-dark'
                                            : 'text-ivory-dim hover:text-ivory'
                                            }`}
                                        disabled={isSubmitting}
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
                                            ? 'bg-dark-50 text-accent shadow-dark'
                                            : 'text-ivory-dim hover:text-ivory'
                                            }`}
                                        disabled={isSubmitting}
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
                                        className="w-full px-4 py-3 input-dark rounded-xl"
                                        placeholder="https://example.com/image.jpg"
                                        disabled={isSubmitting}
                                    />
                                )}

                                {/* Upload Input */}
                                {imageInputType === 'upload' && (
                                    <div className="space-y-2">
                                        <label
                                            htmlFor="image-upload"
                                            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dark-50/40 border-dashed rounded-xl cursor-pointer bg-dark-300/50 hover:bg-dark-200/50 hover:border-accent/30 transition-all duration-200 group"
                                        >
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <div className="p-3 bg-dark-200 rounded-full shadow-dark mb-3 group-hover:scale-110 transition-transform duration-200">
                                                    <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                                    </svg>
                                                </div>
                                                <p className="mb-1 text-sm font-medium text-ivory-muted">
                                                    Click to upload or drag and drop
                                                </p>
                                                <p className="text-xs text-ivory-dim">PNG, JPG, GIF up to 5MB</p>
                                            </div>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                className="hidden"
                                                id="image-upload"
                                                disabled={isSubmitting}
                                            />
                                        </label>
                                    </div>
                                )}

                                {/* Image Preview */}
                                {imagePreview && (
                                    <div className="mt-4 p-3 bg-dark-300 rounded-xl border border-dark-50/20">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs font-semibold text-ivory-dim uppercase tracking-wider">Preview</span>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setFormData({ ...formData, image: '' });
                                                    setImagePreview('');
                                                }}
                                                className="text-red-400 hover:text-red-300 text-xs font-medium hover:underline"
                                                disabled={isSubmitting}
                                            >
                                                Remove
                                            </button>
                                        </div>
                                        <div className="relative w-full h-48 rounded-lg overflow-hidden bg-dark-200">
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
                                <label className="block text-sm font-semibold text-ivory-muted mb-2">
                                    Description
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) =>
                                        setFormData({ ...formData, description: e.target.value })
                                    }
                                    className="w-full px-4 py-3 input-dark rounded-xl"
                                    rows={3}
                                    placeholder="Enter item description..."
                                    disabled={isSubmitting}
                                />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="submit"
                                    className="flex-1 btn-accent py-3.5 px-6 rounded-xl text-base disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Saving...' : editingItem ? 'Update Item' : 'Add Item'}
                                </button>
                                {editingItem && (
                                    <button
                                        type="button"
                                        onClick={handleCancel}
                                        className="px-6 py-3.5 btn-dark rounded-xl disabled:opacity-50"
                                        disabled={isSubmitting}
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>

                    {/* Items List Section */}
                    <div className="dark-card-static rounded-3xl p-6 sm:p-8 shadow-dark-lg flex flex-col h-[800px] animate-reveal-up stagger-4">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-ivory">Inventory Items</h2>
                            <span className="px-3 py-1 bg-accent/10 text-accent rounded-full text-xs font-bold border border-accent/20">
                                {items.length} Items
                            </span>
                        </div>

                        {items.length === 0 ? (
                            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                                <div className="w-20 h-20 bg-dark-200 rounded-full flex items-center justify-center mb-4">
                                    <svg className="w-10 h-10 text-ivory-dim" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 00.586 13H4" />
                                    </svg>
                                </div>
                                <p className="text-ivory-muted font-medium">No items in the menu yet.</p>
                                <p className="text-ivory-dim text-sm mt-1">Add your first item using the form.</p>
                            </div>
                        ) : (
                            <div className="flex-1 overflow-y-auto pr-2 space-y-3">
                                {items.map((item) => (
                                    <div
                                        key={item.id}
                                        className="group bg-dark-300/60 hover:bg-dark-200 border border-dark-50/20 hover:border-accent/20 rounded-2xl p-3 transition-all duration-200 hover:shadow-dark flex gap-4"
                                    >
                                        <div className="relative w-20 h-20 bg-dark-200 rounded-xl overflow-hidden flex-shrink-0 border border-dark-50/20">
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
                                                <div className="w-full h-full flex items-center justify-center bg-dark-200">
                                                    <svg className="w-8 h-8 text-ivory-dim" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex-grow min-w-0 flex flex-col justify-center">
                                            <div className="flex justify-between items-start mb-1">
                                                <h3 className="font-bold text-ivory truncate pr-2">{item.name}</h3>
                                                <span className="font-bold text-accent bg-accent/10 px-2 py-0.5 rounded-lg text-sm border border-accent/15">
                                                    ₹{item.price.toFixed(2)}
                                                </span>
                                            </div>

                                            {item.description && (
                                                <p className="text-sm text-ivory-dim line-clamp-1 mb-2">{item.description}</p>
                                            )}

                                            <div className="flex gap-2 mt-auto">
                                                <button
                                                    onClick={() => handleEdit(item)}
                                                    className="flex-1 bg-dark-200 border border-dark-50/30 hover:border-accent/30 hover:bg-accent/5 text-ivory-muted hover:text-accent py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1"
                                                >
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(item.id)}
                                                    className="flex-1 bg-dark-200 border border-dark-50/30 hover:border-red-500/30 hover:bg-red-500/5 text-ivory-muted hover:text-red-400 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1"
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
