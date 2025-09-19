"use client";

import { useState, useEffect, useCallback } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";
import {
  createDraftFromPublished,
  addItem,
  updateItem,
  archiveItem,
  publishDraft,
  updatePriceList,
} from "./actions";
import { useToast } from "@/components/ToastProvider";

interface PriceList {
  id: string;
  name: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  effectiveAt?: string;
  createdAt: string;
  publishedAt?: string;
  items: PriceItem[];
}

interface PriceItem {
  id: string;
  name: string;
  category: "WASHING" | "ADD_ON" | "REPAIR";
  unitPrice: number;
  taxable: boolean;
  scope: "ITEM" | "ORDER";
  active: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

const CATEGORY_LABELS = {
  WASHING: "Washing",
  ADD_ON: "Add-ons",
  REPAIR: "Repairs",
};

const SCOPE_LABELS = {
  ITEM: "Per Item",
  ORDER: "Order Level",
};

export default function PricingPage() {
  const [priceLists, setPriceLists] = useState<PriceList[]>([]);
  const [selectedList, setSelectedList] = useState<PriceList | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showNewListForm, setShowNewListForm] = useState(false);
  const [showNewItemForm, setShowNewItemForm] = useState(false);
  const [editingItem, setEditingItem] = useState<PriceItem | null>(null);
  const [editingList, setEditingList] = useState<PriceList | null>(null);
  const [newListName, setNewListName] = useState("");
  const [newItem, setNewItem] = useState({
    name: "",
    category: "WASHING" as const,
    unitPrice: 0,
    taxable: true,
    scope: "ITEM" as const,
    active: true,
  });

  const toast = useToast();

  const fetchPriceLists = useCallback(async () => {
    try {
      const response = await fetch("/api/pricing");
      const data = await response.json();

      if (response.ok && data.priceLists) {
        setPriceLists(data.priceLists);
        if (data.priceLists.length > 0 && !selectedList) {
          setSelectedList(data.priceLists[0]);
        }
      } else {
        console.error("API Error:", data.error);
        setPriceLists([]);
      }
    } catch (error) {
      console.error("Error fetching price lists:", error);
      setPriceLists([]);
    } finally {
      setIsLoading(false);
    }
  }, [selectedList]);

  useEffect(() => {
    fetchPriceLists();
  }, [fetchPriceLists]);

  const createPriceList = async () => {
    if (!newListName.trim()) return;

    try {
      await createDraftFromPublished();
      setNewListName("");
      setShowNewListForm(false);
      await fetchPriceLists();
    } catch (error) {
      console.error("Error creating price list:", error);
    }
  };

  const publishPriceList = async (listId: string) => {
    try {
      await publishDraft(listId);
      await fetchPriceLists();
    } catch (error) {
      console.error("Error publishing price list:", error);
    }
  };

  const updatePriceListName = async (list: PriceList) => {
    try {
      await updatePriceList(list.id, { name: list.name });
      setEditingList(null);
      await fetchPriceLists();
    } catch (error) {
      console.error("Error updating price list:", error);
    }
  };

  const createPriceItem = async () => {
    if (!selectedList || !newItem.name.trim() || newItem.unitPrice <= 0) return;

    try {
      await addItem(selectedList.id, newItem);
      setNewItem({
        name: "",
        category: "WASHING",
        unitPrice: 0,
        taxable: true,
        scope: "ITEM",
        active: true,
      });
      setShowNewItemForm(false);
      await fetchPriceLists();
    } catch (error) {
      console.error("Error creating price item:", error);
    }
  };

  const updatePriceItem = async (item: PriceItem) => {
    try {
      await updateItem(item.id, {
        name: item.name,
        unitPrice: item.unitPrice,
        taxable: item.taxable,
      });
      setEditingItem(null);
      await fetchPriceLists();
    } catch (error) {
      console.error("Error updating price item:", error);
    }
  };

  const deletePriceItem = async (itemId: string) => {
    // Simple confirmation - in a real app you might want a proper modal
    const confirmed = window.confirm(
      "Are you sure you want to archive this price item?",
    );
    if (!confirmed) return;

    try {
      await archiveItem(itemId);
      toast.success(
        "Item Archived",
        "Price item has been archived successfully!",
      );
      await fetchPriceLists();
    } catch (error) {
      console.error("Error archiving price item:", error);
      toast.error(
        "Archive Failed",
        "Failed to archive price item. Please try again.",
      );
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const groupedItems =
    selectedList?.items.reduce(
      (acc, item) => {
        if (!acc[item.category]) acc[item.category] = [];
        acc[item.category].push(item);
        return acc;
      },
      {} as Record<string, PriceItem[]>,
    ) || {};

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Pricing Management
        </h1>
        <p className="text-gray-600">
          Manage price lists and items with taxable toggles
        </p>
      </div>

      {/* Price Lists Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow border p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Price Lists</h2>
              <button
                onClick={() => setShowNewListForm(true)}
                className="px-3 py-1 text-indigo-600 hover:text-indigo-800 text-sm border border-indigo-600 rounded"
              >
                + New List
              </button>
            </div>

            {showNewListForm && (
              <div className="mb-4 p-3 border rounded-lg bg-gray-50">
                <input
                  type="text"
                  placeholder="New price list name"
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  className="w-full p-2 border rounded mb-2"
                />
                <div className="flex gap-2">
                  <button
                    onClick={createPriceList}
                    className="px-3 py-1 bg-indigo-600 text-white rounded text-sm"
                  >
                    Create
                  </button>
                  <button
                    onClick={() => setShowNewListForm(false)}
                    className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {editingList && (
              <div className="mb-4 p-3 border rounded-lg bg-blue-50">
                <h3 className="font-medium text-sm mb-2">Edit Price List</h3>
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Price list name"
                    value={editingList.name}
                    onChange={(e) =>
                      setEditingList({ ...editingList, name: e.target.value })
                    }
                    className="w-full p-2 border rounded text-sm"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => updatePriceListName(editingList)}
                      className="px-3 py-1 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-700"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingList(null)}
                      className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-2">
              {priceLists.map((list) => (
                <div
                  key={list.id}
                  className={`p-3 rounded-lg cursor-pointer border ${
                    selectedList?.id === list.id
                      ? "bg-blue-50 border-blue-200"
                      : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                  }`}
                  onClick={() => setSelectedList(list)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-sm">{list.name}</div>
                      <div className="text-xs text-gray-500">
                        {list.status === "PUBLISHED" ? (
                          <span className="text-green-600 font-medium">
                            Published
                          </span>
                        ) : (
                          <span className="text-gray-500">Draft</span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingList(list);
                        }}
                        className="px-2 py-1 text-blue-600 hover:text-blue-800 text-xs border border-blue-600 rounded"
                        title="Edit"
                      >
                        Edit
                      </button>
                      {list.status === "DRAFT" && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            publishPriceList(list.id);
                          }}
                          className="px-2 py-1 text-green-600 hover:text-green-800 text-xs border border-green-600 rounded"
                          title="Publish"
                        >
                          Publish
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Price Items */}
        <div className="lg:col-span-3">
          {selectedList ? (
            <div className="bg-white rounded-lg shadow border">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold">
                      {selectedList.name}
                    </h2>
                    <p className="text-sm text-gray-500">
                      Status:{" "}
                      <span
                        className={`font-medium ${
                          selectedList.status === "PUBLISHED"
                            ? "text-green-600"
                            : "text-gray-500"
                        }`}
                      >
                        {selectedList.status}
                      </span>
                    </p>
                  </div>
                  <button
                    onClick={() => setShowNewItemForm(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  >
                    <PlusIcon className="h-4 w-4" />
                    Add Item
                  </button>
                </div>
              </div>

              <div className="p-6">
                {showNewItemForm && (
                  <div className="mb-6 p-4 border rounded-lg bg-gray-50">
                    <h3 className="font-semibold mb-3">Add New Price Item</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Item Name
                        </label>
                        <input
                          type="text"
                          value={newItem.name}
                          onChange={(e) =>
                            setNewItem({ ...newItem, name: e.target.value })
                          }
                          className="w-full p-2 border rounded-lg"
                          placeholder="e.g., Heavyweight Blanket"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Category
                        </label>
                        <select
                          value={newItem.category}
                          onChange={(e) =>
                            setNewItem({
                              ...newItem,
                              category: e.target.value as any,
                            })
                          }
                          className="w-full p-2 border rounded-lg"
                        >
                          <option value="WASHING">Washing</option>
                          <option value="ADD_ON">Add-ons</option>
                          <option value="REPAIR">Repairs</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Unit Price ($)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={newItem.unitPrice}
                          onChange={(e) =>
                            setNewItem({
                              ...newItem,
                              unitPrice: parseFloat(e.target.value) || 0,
                            })
                          }
                          className="w-full p-2 border rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Scope
                        </label>
                        <select
                          value={newItem.scope}
                          onChange={(e) =>
                            setNewItem({
                              ...newItem,
                              scope: e.target.value as any,
                            })
                          }
                          className="w-full p-2 border rounded-lg"
                        >
                          <option value="ITEM">Per Item</option>
                          <option value="ORDER">Order Level</option>
                        </select>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center gap-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={newItem.taxable}
                          onChange={(e) =>
                            setNewItem({
                              ...newItem,
                              taxable: e.target.checked,
                            })
                          }
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">Taxable</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={newItem.active}
                          onChange={(e) =>
                            setNewItem({ ...newItem, active: e.target.checked })
                          }
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">Active</span>
                      </label>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={createPriceItem}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                      >
                        Add Item
                      </button>
                      <button
                        onClick={() => setShowNewItemForm(false)}
                        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Grouped Items by Category */}
                {Object.entries(groupedItems).map(([category, items]) => (
                  <div key={category} className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">
                      {
                        CATEGORY_LABELS[
                          category as keyof typeof CATEGORY_LABELS
                        ]
                      }
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse border border-gray-200">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="border border-gray-200 p-3 text-left font-semibold">
                              Item
                            </th>
                            <th className="border border-gray-200 p-3 text-right font-semibold">
                              Price
                            </th>
                            <th className="border border-gray-200 p-3 text-center font-semibold">
                              Scope
                            </th>
                            <th className="border border-gray-200 p-3 text-center font-semibold">
                              Taxable
                            </th>
                            <th className="border border-gray-200 p-3 text-center font-semibold">
                              Status
                            </th>
                            <th className="border border-gray-200 p-3 text-center font-semibold">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {items.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50">
                              <td className="border border-gray-200 p-3">
                                {editingItem?.id === item.id ? (
                                  <input
                                    type="text"
                                    value={editingItem.name}
                                    onChange={(e) =>
                                      setEditingItem({
                                        ...editingItem,
                                        name: e.target.value,
                                      })
                                    }
                                    className="w-full p-1 border rounded"
                                  />
                                ) : (
                                  <span className="font-medium">
                                    {item.name}
                                  </span>
                                )}
                              </td>
                              <td className="border border-gray-200 p-3 text-right">
                                {editingItem?.id === item.id ? (
                                  <input
                                    type="number"
                                    step="0.01"
                                    value={editingItem.unitPrice}
                                    onChange={(e) =>
                                      setEditingItem({
                                        ...editingItem,
                                        unitPrice:
                                          parseFloat(e.target.value) || 0,
                                      })
                                    }
                                    className="w-full p-1 border rounded text-right"
                                  />
                                ) : (
                                  <span className="font-medium">
                                    {formatCurrency(item.unitPrice)}
                                  </span>
                                )}
                              </td>
                              <td className="border border-gray-200 p-3 text-center">
                                {editingItem?.id === item.id ? (
                                  <select
                                    value={editingItem.scope}
                                    onChange={(e) =>
                                      setEditingItem({
                                        ...editingItem,
                                        scope: e.target.value as any,
                                      })
                                    }
                                    className="p-1 border rounded"
                                  >
                                    <option value="ITEM">Per Item</option>
                                    <option value="ORDER">Order Level</option>
                                  </select>
                                ) : (
                                  <span className="text-sm text-gray-600">
                                    {SCOPE_LABELS[item.scope]}
                                  </span>
                                )}
                              </td>
                              <td className="border border-gray-200 p-3 text-center">
                                {editingItem?.id === item.id ? (
                                  <input
                                    type="checkbox"
                                    checked={editingItem.taxable}
                                    onChange={(e) =>
                                      setEditingItem({
                                        ...editingItem,
                                        taxable: e.target.checked,
                                      })
                                    }
                                    className="mr-2"
                                  />
                                ) : (
                                  <span
                                    className={`text-sm font-medium ${
                                      item.taxable
                                        ? "text-green-600"
                                        : "text-gray-500"
                                    }`}
                                  >
                                    {item.taxable ? "Yes" : "No"}
                                  </span>
                                )}
                              </td>
                              <td className="border border-gray-200 p-3 text-center">
                                <span
                                  className={`text-xs px-2 py-1 rounded-full ${
                                    item.active
                                      ? "bg-green-100 text-green-800"
                                      : "bg-gray-100 text-gray-600"
                                  }`}
                                >
                                  {item.active ? "Active" : "Inactive"}
                                </span>
                              </td>
                              <td className="border border-gray-200 p-3 text-center">
                                {editingItem?.id === item.id ? (
                                  <div className="flex gap-1 justify-center">
                                    <button
                                      onClick={() =>
                                        updatePriceItem(editingItem)
                                      }
                                      className="px-2 py-1 text-green-600 hover:text-green-800 text-xs border border-green-600 rounded"
                                      title="Save"
                                    >
                                      Save
                                    </button>
                                    <button
                                      onClick={() => setEditingItem(null)}
                                      className="px-2 py-1 text-gray-600 hover:text-gray-800 text-xs border border-gray-600 rounded"
                                      title="Cancel"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                ) : (
                                  <div className="flex gap-1 justify-center">
                                    <button
                                      onClick={() => setEditingItem(item)}
                                      className="px-2 py-1 text-blue-600 hover:text-blue-800 text-xs border border-blue-600 rounded"
                                      title="Edit"
                                    >
                                      Edit
                                    </button>
                                    <button
                                      onClick={() => deletePriceItem(item.id)}
                                      className="px-2 py-1 text-red-600 hover:text-red-800 text-xs border border-red-600 rounded"
                                      title="Archive"
                                    >
                                      Archive
                                    </button>
                                  </div>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}

                {selectedList.items.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <p>No price items in this list yet.</p>
                    <button
                      onClick={() => setShowNewItemForm(true)}
                      className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                    >
                      Add your first item
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : priceLists.length === 0 ? (
            <div className="bg-white rounded-lg shadow border p-8 text-center">
              <p className="text-gray-500 mb-4">No price lists found.</p>
              <button
                onClick={() => setShowNewListForm(true)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Create your first price list
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow border p-8 text-center">
              <p className="text-gray-500">Select a price list to view items</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
