import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { DollarSign, TrendingDown, TrendingUp } from "lucide-react";
import type { FieldDataFormData } from '@/pages/DataOperatorFieldDataCollectionNew';

interface Step6Props {
  formData: FieldDataFormData;
  updateFormData: (updates: Partial<FieldDataFormData>) => void;
}

const Step6FinancialInfo: React.FC<Step6Props> = ({ formData, updateFormData }) => {
  // Auto-calculate total expenses
  useEffect(() => {
    const costs = [
      parseFloat(formData.seed_cost || '0'),
      parseFloat(formData.fertilizer_cost || '0'),
      parseFloat(formData.pesticide_cost || '0'),
      parseFloat(formData.labor_cost || '0'),
      parseFloat(formData.irrigation_cost || '0'),
      parseFloat(formData.land_preparation_cost || '0'),
      parseFloat(formData.equipment_rent || '0'),
      parseFloat(formData.transport_cost_production || '0'),
    ];
    const total = costs.reduce((sum, cost) => sum + cost, 0);
    updateFormData({ total_expenses: total.toFixed(2) });
  }, [
    formData.seed_cost,
    formData.fertilizer_cost,
    formData.pesticide_cost,
    formData.labor_cost,
    formData.irrigation_cost,
    formData.land_preparation_cost,
    formData.equipment_rent,
    formData.transport_cost_production,
    updateFormData,
  ]);

  // Auto-calculate total income and net profit
  useEffect(() => {
    const soldQty = parseFloat(formData.sold_quantity || '0');
    const salePrice = parseFloat(formData.sale_price || '0');
    const totalIncome = soldQty * salePrice;
    
    const totalExpenses = parseFloat(formData.total_expenses || '0');
    const netProfit = totalIncome - totalExpenses;
    
    updateFormData({
      total_income: totalIncome.toFixed(2),
      net_profit: netProfit.toFixed(2),
    });
  }, [formData.sold_quantity, formData.sale_price, formData.total_expenses, updateFormData]);

  const netProfit = parseFloat(formData.net_profit || '0');
  const isProfitable = netProfit >= 0;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <TrendingDown className="h-5 w-5" />
            খরচের বিবরণ (টাকা)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="seed_cost">বীজ খরচ</Label>
              <Input
                id="seed_cost"
                type="number"
                step="0.01"
                value={formData.seed_cost}
                onChange={(e) => updateFormData({ seed_cost: e.target.value })}
                placeholder="টাকা"
              />
            </div>

            <div>
              <Label htmlFor="fertilizer_cost">সার খরচ</Label>
              <Input
                id="fertilizer_cost"
                type="number"
                step="0.01"
                value={formData.fertilizer_cost}
                onChange={(e) => updateFormData({ fertilizer_cost: e.target.value })}
                placeholder="টাকা"
              />
            </div>

            <div>
              <Label htmlFor="pesticide_cost">কীটনাশক খরচ</Label>
              <Input
                id="pesticide_cost"
                type="number"
                step="0.01"
                value={formData.pesticide_cost}
                onChange={(e) => updateFormData({ pesticide_cost: e.target.value })}
                placeholder="টাকা"
              />
            </div>

            <div>
              <Label htmlFor="labor_cost">শ্রমিক খরচ</Label>
              <Input
                id="labor_cost"
                type="number"
                step="0.01"
                value={formData.labor_cost}
                onChange={(e) => updateFormData({ labor_cost: e.target.value })}
                placeholder="টাকা"
              />
            </div>

            <div>
              <Label htmlFor="irrigation_cost">সেচ খরচ</Label>
              <Input
                id="irrigation_cost"
                type="number"
                step="0.01"
                value={formData.irrigation_cost}
                onChange={(e) => updateFormData({ irrigation_cost: e.target.value })}
                placeholder="টাকা"
              />
            </div>

            <div>
              <Label htmlFor="land_preparation_cost">জমি তৈরি খরচ</Label>
              <Input
                id="land_preparation_cost"
                type="number"
                step="0.01"
                value={formData.land_preparation_cost}
                onChange={(e) => updateFormData({ land_preparation_cost: e.target.value })}
                placeholder="টাকা"
              />
            </div>

            <div>
              <Label htmlFor="equipment_rent">যন্ত্রপাতি ভাড়া</Label>
              <Input
                id="equipment_rent"
                type="number"
                step="0.01"
                value={formData.equipment_rent}
                onChange={(e) => updateFormData({ equipment_rent: e.target.value })}
                placeholder="টাকা"
              />
            </div>

            <div>
              <Label htmlFor="transport_cost_production">পরিবহন খরচ</Label>
              <Input
                id="transport_cost_production"
                type="number"
                step="0.01"
                value={formData.transport_cost_production}
                onChange={(e) => updateFormData({ transport_cost_production: e.target.value })}
                placeholder="টাকা"
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="total_expenses" className="text-lg font-bold">মোট খরচ (টাকা)</Label>
              <Input
                id="total_expenses"
                type="number"
                value={formData.total_expenses}
                readOnly
                className="text-lg font-bold bg-red-50 border-red-300"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <TrendingUp className="h-5 w-5" />
            উৎপাদন ও বিক্রয়
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="total_production">মোট উৎপাদন (কেজি/মণ)</Label>
              <Input
                id="total_production"
                type="number"
                step="0.01"
                value={formData.total_production}
                onChange={(e) => updateFormData({ total_production: e.target.value })}
                placeholder="পরিমাণ"
              />
            </div>

            <div>
              <Label htmlFor="sold_quantity">বিক্রিত পরিমাণ (কেজি/মণ)</Label>
              <Input
                id="sold_quantity"
                type="number"
                step="0.01"
                value={formData.sold_quantity}
                onChange={(e) => updateFormData({ sold_quantity: e.target.value })}
                placeholder="পরিমাণ"
              />
            </div>

            <div>
              <Label htmlFor="sale_price">বিক্রয় মূল্য (টাকা/কেজি বা মণ)</Label>
              <Input
                id="sale_price"
                type="number"
                step="0.01"
                value={formData.sale_price}
                onChange={(e) => updateFormData({ sale_price: e.target.value })}
                placeholder="টাকা"
              />
            </div>

            <div>
              <Label htmlFor="total_income" className="text-lg font-bold">মোট আয় (টাকা)</Label>
              <Input
                id="total_income"
                type="number"
                value={formData.total_income}
                readOnly
                className="text-lg font-bold bg-green-50 border-green-300"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <DollarSign className="h-5 w-5" />
            লাভ/ক্ষতি হিসাব
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="net_profit" className="text-xl font-bold">নিট লাভ/ক্ষতি (টাকা)</Label>
            <Input
              id="net_profit"
              type="number"
              value={formData.net_profit}
              readOnly
              className={`text-xl font-bold ${
                isProfitable 
                  ? 'bg-green-100 border-green-400 text-green-800' 
                  : 'bg-red-100 border-red-400 text-red-800'
              }`}
            />
          </div>

          <Alert className={`mt-4 ${isProfitable ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'}`}>
            <AlertDescription className={isProfitable ? 'text-green-900' : 'text-red-900'}>
              {isProfitable ? (
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  <span className="font-semibold">লাভজনক!</span>
                  <span>এই চাষে {Math.abs(netProfit).toFixed(2)} টাকা লাভ হয়েছে</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <TrendingDown className="h-5 w-5" />
                  <span className="font-semibold">ক্ষতি!</span>
                  <span>এই চাষে {Math.abs(netProfit).toFixed(2)} টাকা ক্ষতি হয়েছে</span>
                </div>
              )}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="font-semibold text-yellow-900 mb-2">হিসাব টিপস:</h4>
        <ul className="list-disc list-inside text-sm text-yellow-800 space-y-1">
          <li>সব খরচের খাত সঠিকভাবে লিখুন</li>
          <li>মোট খরচ স্বয়ংক্রিয়ভাবে হিসাব হবে</li>
          <li>বিক্রিত পরিমাণ ও মূল্য দিয়ে আয় হিসাব হবে</li>
          <li>নিট লাভ/ক্ষতি স্বয়ংক্রিয়ভাবে দেখাবে</li>
        </ul>
      </div>
    </div>
  );
};

export default Step6FinancialInfo;
