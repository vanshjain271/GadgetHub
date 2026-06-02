import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Typography, Card, CardContent, Grid, Button, Tabs, Tab,
  Paper, ToggleButtonGroup, ToggleButton, CircularProgress, Alert, Stack
} from '@mui/material';
import {
  Download, ShoppingCart, People, Inventory,
  TableChart, CalendarMonth, Receipt
} from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5005/api/v1';
const COLORS = ['#2563EB', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

type DatePreset = '1w' | '1m' | '3m' | '6m' | '1y' | 'all';

const DATE_PRESETS: { label: string; value: DatePreset }[] = [
  { label: '1 Week', value: '1w' },
  { label: '1 Month', value: '1m' },
  { label: '3 Months', value: '3m' },
  { label: '6 Months', value: '6m' },
  { label: '1 Year', value: '1y' },
  { label: 'All Time', value: 'all' },
];

const getDateRange = (preset: DatePreset): { dateFrom?: string; dateTo?: string } => {
  const now = new Date();
  const dateTo = now.toISOString().split('T')[0];
  let from: Date;

  switch (preset) {
    case '1w': from = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); break;
    case '1m': from = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate()); break;
    case '3m': from = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate()); break;
    case '6m': from = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate()); break;
    case '1y': from = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate()); break;
    case 'all': return {};
  }

  return { dateFrom: from!.toISOString().split('T')[0], dateTo };
};

const Reports: React.FC = () => {
  const [tab, setTab] = useState(0);
  const [datePreset, setDatePreset] = useState<DatePreset>('3m');
  const [selectedReportType, setSelectedReportType] = useState('sales');
  const [salesByProduct, setSalesByProduct] = useState<any[]>([]);
  const [salesByCategory, setSalesByCategory] = useState<any[]>([]);
  const [summaryStats, setSummaryStats] = useState({ totalRevenue: 0, totalOrders: 0, totalCustomers: 0, productsSold: 0 });
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState('');

  const reportTypes = [
    { id: 'sales', label: 'Sales Report', icon: <ShoppingCart />, desc: 'Detailed breakdown of sales, taxes, and discounts.' },
    { id: 'invoice', label: 'Invoice Report', icon: <Receipt />, desc: 'List of all generated invoices and their payment status.' },
    { id: 'customer', label: 'Customer Report', icon: <People />, desc: 'Customer purchase history and acquisition data.' },
    { id: 'inventory', label: 'Inventory Report', icon: <Inventory />, desc: 'Current stock levels, valuation, and SKU details.' },
  ];

  const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
  });

  const buildDateParams = useCallback(() => {
    const range = getDateRange(datePreset);
    const params = new URLSearchParams();
    if (range.dateFrom) params.set('dateFrom', range.dateFrom);
    if (range.dateTo) params.set('dateTo', range.dateTo);
    return params.toString();
  }, [datePreset]);

  const loadReports = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const dateParams = buildDateParams();

      const [productRes, categoryRes, salesRes] = await Promise.all([
        fetch(`${API_BASE}/admin/reports/sales/by-product?limit=10&${dateParams}`, { headers: getAuthHeaders() }),
        fetch(`${API_BASE}/admin/reports/sales/by-category?${dateParams}`, { headers: getAuthHeaders() }),
        fetch(`${API_BASE}/admin/reports/sales?${dateParams}`, { headers: getAuthHeaders() })
      ]);

      const productData = await productRes.json();
      const categoryData = await categoryRes.json();
      const salesData = await salesRes.json();

      if (productData.success) setSalesByProduct(productData.data || []);
      if (categoryData.success) setSalesByCategory(categoryData.data || []);

      if (salesData.success && salesData.report) {
        const report = salesData.report;
        setSummaryStats({
          totalRevenue: report.summary?.totalRevenue || report.totalRevenue || 0,
          totalOrders: report.summary?.totalOrders || report.totalOrders || 0,
          totalCustomers: report.summary?.uniqueCustomers || report.uniqueCustomers || 0,
          productsSold: report.summary?.totalItemsSold || report.totalItemsSold || 0,
        });
      }
    } catch (err) {
      console.error('Failed to load reports', err);
      setError('Failed to load report data. Please try again.');
    }
    setLoading(false);
  }, [buildDateParams]);

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  const exportReport = async (type: string, format: 'csv' | 'xlsx') => {
    setExporting(true);
    try {
      const dateParams = buildDateParams();
      const url = `${API_BASE}/admin/reports/${type}?format=${format}&${dateParams}`;
      const response = await fetch(url, { headers: getAuthHeaders() });
      if (!response.ok) throw new Error('Export failed');
      const blob = await response.blob();
      const downloadUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      const presetLabel = DATE_PRESETS.find(p => p.value === datePreset)?.label?.replace(/\s/g, '-') || 'all';
      a.download = `${type}-report-${presetLabel}-${new Date().toISOString().split('T')[0]}.${format === 'csv' ? 'csv' : 'xlsx'}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      console.error('Export failed:', err);
      setError('Export failed. Please try again.');
    }
    setExporting(false);
  };

  const presetLabel = DATE_PRESETS.find(p => p.value === datePreset)?.label || '';

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4, alignItems: 'center' }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>Reports & Analytics</Typography>
        <Stack direction="row" spacing={2}>
          <Button variant="outlined" startIcon={<TableChart />}>History</Button>
          <Button variant="contained" startIcon={<Download />}>Generate</Button>
        </Stack>
      </Box>

      <Grid container spacing={3}>
        {/* Left Column: Report Selector & Export settings */}
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3, mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Select Report</Typography>
              <Stack spacing={1}>
                {reportTypes.map((rt) => (
                  <Paper
                    key={rt.id}
                    onClick={() => setSelectedReportType(rt.id)}
                    sx={{
                      p: 2, borderRadius: 2, cursor: 'pointer', border: '1px solid',
                      borderColor: selectedReportType === rt.id ? 'primary.main' : 'transparent',
                      backgroundColor: selectedReportType === rt.id ? '#F0F9FF' : '#F8FAFC'
                    }}
                  >
                    <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                      <Box sx={{ color: selectedReportType === rt.id ? 'primary.main' : 'text.secondary' }}>{rt.icon}</Box>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: selectedReportType === rt.id ? 'primary.main' : 'text.primary' }}>{rt.label}</Typography>
                        <Typography variant="caption" color="text.secondary">{rt.desc}</Typography>
                      </Box>
                    </Box>
                  </Paper>
                ))}
              </Stack>
            </CardContent>
          </Card>

          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Export Settings</Typography>
              <Button
                variant="contained" fullWidth startIcon={<Download />} disabled={exporting}
                onClick={() => exportReport(selectedReportType, 'xlsx')}
                sx={{ borderRadius: 2 }}
              >
                {exporting ? 'Generating...' : 'Download Excel'}
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Right Column: Visualization & Data */}
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 2, mb: 3, borderRadius: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <CalendarMonth color="action" />
              <ToggleButtonGroup
                value={datePreset}
                exclusive
                onChange={(_, v) => v && setDatePreset(v)}
                size="small"
              >
                {DATE_PRESETS.map(p => (
                  <ToggleButton key={p.value} value={p.value} sx={{ px: 2, textTransform: 'none' }}>{p.label}</ToggleButton>
                ))}
              </ToggleButtonGroup>
              {loading && <CircularProgress size={20} />}
            </Box>
          </Card>

          {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}

          <Grid container spacing={2} sx={{ mb: 3 }}>
            {[
              { label: 'Revenue', value: `₹${summaryStats.totalRevenue.toLocaleString()}`, color: '#2563EB' },
              { label: 'Orders', value: summaryStats.totalOrders, color: '#F59E0B' },
              { label: 'Customers', value: summaryStats.totalCustomers, color: '#10B981' },
              { label: 'Sold', value: summaryStats.productsSold, color: '#8B5CF6' },
            ].map((stat, i) => (
              <Grid item xs={6} sm={3} key={i}>
                <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 2, backgroundColor: '#F8FAFC' }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: stat.color }}>{stat.value}</Typography>
                  <Typography variant="caption" color="text.secondary">{stat.label}</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>

          <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }}>
            <Tab label="Products" />
            <Tab label="Categories" />
          </Tabs>

          {tab === 0 && (
            <Card sx={{ borderRadius: 3 }}>
              <CardContent>
                <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>Top Products — {presetLabel}</Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={salesByProduct.slice(0, 5)} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" hide />
                    <YAxis type="category" dataKey="productName" width={100} tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="totalRevenue" fill="#2563EB" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {tab === 1 && (
            <Card sx={{ borderRadius: 3 }}>
              <CardContent>
                <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>Category Share — {presetLabel}</Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={salesByCategory} dataKey="totalRevenue" nameKey="categoryName" cx="50%" cy="50%" outerRadius={80} label>
                      {salesByCategory.map((_, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default Reports;
