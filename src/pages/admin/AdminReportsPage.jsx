import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { formatINR, formatKolkataTime } from '../../utils/formatters';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { useToast } from '../../context/ToastContext';
import {
  Download,
  Printer,
  Calendar,
  ShoppingBag,
  TrendingUp,
  Search,
  Layers,
  UtensilsCrossed,
  Flame,
  Tag,
  IndianRupee,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChefHat,
  ArrowUpDown,
  FileSpreadsheet
} from 'lucide-react';

export const AdminReportsPage = () => {
  const { user } = useAuth();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  // Filters
  // Modes: 'all', 'today', 'range', 'month', 'customer'
  const [reportType, setReportType] = useState('all');
  const [orderStatusFilter, setOrderStatusFilter] = useState('Completed');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [selectedMonth, setSelectedMonth] = useState((new Date().getMonth() + 1).toString());
  const [customerSearch, setCustomerSearch] = useState('');

  // Local filter search inside items/categories
  const [itemSearch, setItemSearch] = useState('');
  const [categorySearch, setCategorySearch] = useState('');

  // Active section view tab: 'all', 'orders'
  const [activeSection, setActiveSection] = useState('all');

  const getTodayStr = () => new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (reportType === 'range' && !startDate) {
      return;
    }
    loadReport();
  }, [reportType, orderStatusFilter, selectedYear, selectedMonth, startDate, endDate]);

  const loadReport = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      if (reportType === 'today') {
        params.append('startDate', getTodayStr());
      } else if (reportType === 'range' && startDate) {
        params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);
      } else if (reportType === 'month') {
        params.append('year', selectedYear);
        params.append('month', selectedMonth);
      } else if (reportType === 'customer' && customerSearch) {
        params.append('customerSearch', customerSearch);
      }

      // Strictly Completed orders only
      params.append('orderStatus', 'Completed');

      // If reportType === 'all', no date params needed (loads all café reports)
      params.append('_t', Date.now().toString());

      const res = await api.get(`/reports/sales?${params.toString()}`);
      if (res.success) {
        setReport(res.report);
      }
    } catch (err) {
      console.error('Failed to load report:', err);
      toast.showError('Could not compute sales report');
    } finally {
      setLoading(false);
    }
  };

  const [exportLoading, setExportLoading] = useState(false);

  const handleExport = async (format = 'excel') => {
    try {
      setExportLoading(true);
      const params = new URLSearchParams();
      if (reportType === 'today') {
        params.append('startDate', getTodayStr());
      } else if (reportType === 'range' && startDate) {
        params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);
      } else if (reportType === 'month') {
        params.append('year', selectedYear);
        params.append('month', selectedMonth);
      } else if (reportType === 'customer' && customerSearch) {
        params.append('customerSearch', customerSearch);
      }

      // Strictly Completed orders only
      params.append('orderStatus', 'Completed');

      if (format === 'excel') {
        params.append('format', 'excel');
      }


      const blob = await api.download(`/reports/export-csv?${params.toString()}`);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const ext = format === 'excel' ? 'xlsx' : 'csv';
      a.download = `${user?.cafe?.slug || 'cafe'}-${format === 'excel' ? 'styled-report' : 'report'}-${reportType}-${Date.now()}.${ext}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      toast.showSuccess(
        format === 'excel'
          ? 'Styled color report exported to Excel (.xlsx) successfully'
          : 'Sales report exported to CSV successfully'
      );
    } catch (err) {
      toast.showError('Failed to export report');
    } finally {
      setExportLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const summary = report?.summary || {
    totalOrders: 0,
    activeOrders: 0,
    todayOrdersCount: 0,
    todayTotalCombosCount: 0,
    cancelledOrders: 0,
    completedOrders: 0,
    grossCollectedPaise: 0,
    refundedAmountPaise: 0,
    netCollectedPaise: 0
  };

  const orders = report?.orders || [];
  const comboSales = report?.comboSales || [];
  const categorySales = report?.categorySales || [];
  const itemSales = report?.itemSales || [];

  // Helper to format date cleanly in Indian English
  const formatDateDisplay = (dateStr) => {
    if (!dateStr) return '';
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const y = parseInt(parts[0], 10);
        const m = parseInt(parts[1], 10) - 1;
        const d = parseInt(parts[2], 10);
        const dt = new Date(y, m, d);
        if (!isNaN(dt.getTime())) {
          return dt.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
        }
      }
      return dateStr;
    } catch {
      return dateStr;
    }
  };

  // Dynamic scope details based on active filter
  const scopeDetails = useMemo(() => {
    if (reportType === 'today') {
      const todayFormatted = new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
      return {
        title: "Today's Order Summary: Categories & Kitchen Prep Demand",
        subtitle: `Live aggregated requirements for all orders scheduled or created today (${todayFormatted})`,
        periodLabel: "Today's",
        tagLabel: 'TODAY'
      };
    }
    if (reportType === 'range') {
      if (startDate && (!endDate || startDate === endDate)) {
        const dFormatted = formatDateDisplay(startDate);
        return {
          title: `Order Summary (${dFormatted}): Categories & Kitchen Prep Demand`,
          subtitle: `Aggregated requirements for all orders scheduled for pickup on ${dFormatted}`,
          periodLabel: dFormatted,
          tagLabel: 'SELECTED'
        };
      }
      const startFmt = formatDateDisplay(startDate);
      const endFmt = formatDateDisplay(endDate);
      return {
        title: `Date Range Summary: Categories & Kitchen Prep Demand`,
        subtitle: `Aggregated requirements for orders scheduled between ${startFmt} and ${endFmt}`,
        periodLabel: `${startDate} to ${endDate}`,
        tagLabel: 'RANGE'
      };
    }
    if (reportType === 'month') {
      const monthNames = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      const mName = monthNames[parseInt(selectedMonth, 10)] || selectedMonth;
      return {
        title: `${mName} ${selectedYear} Summary: Categories & Kitchen Prep Demand`,
        subtitle: `Aggregated requirements for orders scheduled in ${mName} ${selectedYear}`,
        periodLabel: `${mName} ${selectedYear}`,
        tagLabel: `${mName.toUpperCase()}`
      };
    }
    if (reportType === 'customer') {
      return {
        title: `Customer Summary: Categories & Kitchen Prep Demand`,
        subtitle: customerSearch ? `Aggregated requirements for orders matching "${customerSearch}"` : 'Aggregated requirements for customer search',
        periodLabel: customerSearch || 'Customer',
        tagLabel: 'CUSTOMER'
      };
    }
    return {
      title: `All Orders Summary: Categories & Kitchen Prep Demand`,
      subtitle: `All-time aggregated requirements across all orders on record`,
      periodLabel: 'All Orders',
      tagLabel: 'ALL'
    };
  }, [reportType, startDate, endDate, selectedMonth, selectedYear, customerSearch]);

  // Extract active demand count for an item, combo, or category in the current filter view
  const getDemandCount = (entry) => {
    if (!entry) return 0;
    if (reportType === 'today') {
      return (entry.todayCount ?? entry.totalQuantity) || 0;
    }
    // When a date or range is filtered, totalQuantity contains that selected period's count!
    return entry.totalQuantity || 0;
  };

  // Active Combos demanded in the selected filter view
  const activeCombos = useMemo(() => {
    return comboSales
      .map(c => ({ ...c, demandCount: getDemandCount(c) }))
      .filter(c => c.demandCount > 0)
      .sort((a, b) => b.demandCount - a.demandCount);
  }, [comboSales, reportType]);

  // Active Kitchen items to prepare in the selected filter view
  const activeItems = useMemo(() => {
    return itemSales
      .map(i => ({ ...i, demandCount: getDemandCount(i) }))
      .filter(i => i.demandCount > 0)
      .sort((a, b) => b.demandCount - a.demandCount);
  }, [itemSales, reportType]);

  // Active Categories demanded in the selected filter view
  const activeCategories = useMemo(() => {
    return categorySales
      .map(c => ({ ...c, demandCount: getDemandCount(c) }))
      .filter(c => c.demandCount > 0)
      .sort((a, b) => b.demandCount - a.demandCount);
  }, [categorySales, reportType]);

  // Total quantity across categories for percentage calculation
  const totalCategoryUnits = useMemo(() => {
    return categorySales.reduce((sum, c) => sum + (c.totalQuantity || 0), 0) || 1;
  }, [categorySales]);

  // Total items/portions needed in the active scope
  const totalActivePortions = useMemo(() => {
    return activeItems.reduce((sum, i) => sum + i.demandCount, 0);
  }, [activeItems]);

  // Total combos ordered in the active scope
  const totalActiveCombos = useMemo(() => {
    return activeCombos.reduce((sum, c) => sum + c.demandCount, 0);
  }, [activeCombos]);

  // Filtered items for table (Exclude 0-count items. Sorted desc by demand count)
  const filteredItems = useMemo(() => {
    let list = itemSales.filter((i) => (i.totalQuantity || 0) > 0 || (i.todayCount || 0) > 0);
    if (reportType === 'today') {
      list = list.filter((i) => (i.todayCount || 0) > 0 || (i.totalQuantity || 0) > 0);
    }
    if (itemSearch.trim()) {
      const q = itemSearch.toLowerCase();
      list = list.filter((i) => i.name?.toLowerCase().includes(q));
    }
    return [...list].sort((a, b) => {
      const cntA = getDemandCount(a);
      const cntB = getDemandCount(b);
      return cntB - cntA;
    });
  }, [itemSales, itemSearch, reportType]);

  // Filtered categories for table
  const filteredCategories = useMemo(() => {
    let list = categorySales.filter((c) => (c.totalQuantity || 0) > 0 || (c.todayCount || 0) > 0);
    if (reportType === 'today') {
      list = list.filter((c) => (c.todayCount || 0) > 0 || (c.totalQuantity || 0) > 0);
    }
    if (categorySearch.trim()) {
      const q = categorySearch.toLowerCase();
      list = list.filter((c) => c.name?.toLowerCase().includes(q));
    }
    return [...list].sort((a, b) => {
      const cntA = getDemandCount(a);
      const cntB = getDemandCount(b);
      return cntB - cntA;
    });
  }, [categorySales, categorySearch, reportType]);

  // Filtered combos for table
  const filteredCombos = useMemo(() => {
    let list = comboSales.filter((c) => (c.totalQuantity || 0) > 0 || (c.todayCount || 0) > 0);
    if (reportType === 'today') {
      list = list.filter((c) => (c.todayCount || 0) > 0 || (c.totalQuantity || 0) > 0);
    }
    return [...list].sort((a, b) => {
      const cntA = getDemandCount(a);
      const cntB = getDemandCount(b);
      return cntB - cntA;
    });
  }, [comboSales, reportType]);

  return (
    <div>
      <AdminHeader
        title="Financial & Kitchen Sales Reports"
        subtitle={`Authoritative revenue metrics, category sales & item demand for ${user?.cafe?.name || 'JECCAFE'}`}
        actions={
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
            <button
              onClick={handlePrint}
              className="btn btn-outline btn-sm"
              style={{
                gap: '6px',
                fontWeight: 700,
                borderRadius: '10px',
                background: '#FFFFFF'
              }}
            >
              <Printer size={15} />
              <span>Print</span>
            </button>

            {/* Styled Excel with Colors */}
            <button
              onClick={() => handleExport('excel')}
              disabled={exportLoading}
              className="btn btn-sm"
              style={{
                gap: '7px',
                background: 'linear-gradient(135deg, #15803D 0%, #166534 100%)',
                color: '#FFFFFF',
                border: '1.5px solid #16A34A',
                fontWeight: 700,
                borderRadius: '10px',
                boxShadow: '0 2px 8px rgba(22, 163, 74, 0.25)',
                cursor: 'pointer'
              }}
              title="Download styled Excel spreadsheet with full colors, category demand, item prep, and financial KPIs"
            >
              <FileSpreadsheet size={15} color="#BBF7D0" />
              <span>{exportLoading ? 'Exporting...' : 'Export Excel (Colors)'}</span>
            </button>

            {/* Standard CSV */}
            <button
              onClick={() => handleExport('csv')}
              disabled={exportLoading}
              className="btn btn-sm"
              style={{
                gap: '6px',
                background: 'linear-gradient(135deg, #FFFDF9 0%, #FAF2EA 100%)',
                color: '#9A3412',
                border: '1.5px solid #D66C3E',
                fontWeight: 700,
                borderRadius: '10px',
                boxShadow: '0 2px 8px rgba(214, 108, 62, 0.1)',
                cursor: 'pointer'
              }}
              title="Download comprehensive standard CSV report"
            >
              <Download size={14} color="#C25E30" />
              <span>Export CSV</span>
            </button>
          </div>
        }
      />


      <div className="admin-page-container">
        {/* 1. Main Filter Card */}
        <div className="reports-filter-card">
          <div className="reports-filter-top-row">
            {/* Quick Preset Time Buttons */}
            <div className="reports-type-pills">
              <button
                type="button"
                className={`reports-type-pill-btn ${reportType === 'all' ? 'active' : ''}`}
                onClick={() => setReportType('all')}
              >
                <FileSpreadsheet size={14} />
                <span>All Reports</span>
              </button>

              <button
                type="button"
                className={`reports-type-pill-btn ${reportType === 'today' ? 'active' : ''}`}
                onClick={() => setReportType('today')}
              >
                <Flame size={14} />
                <span>Today's Report</span>
              </button>

              <button
                type="button"
                className={`reports-type-pill-btn ${reportType === 'range' ? 'active' : ''}`}
                onClick={() => {
                  setReportType('range');
                  if (!startDate) setStartDate(getTodayStr());
                  if (!endDate) setEndDate(getTodayStr());
                }}
              >
                <Calendar size={14} />
                <span>Date Range</span>
              </button>

              <button
                type="button"
                className={`reports-type-pill-btn ${reportType === 'month' ? 'active' : ''}`}
                onClick={() => setReportType('month')}
              >
                <Calendar size={14} />
                <span>Month & Year</span>
              </button>

              <button
                type="button"
                className={`reports-type-pill-btn ${reportType === 'customer' ? 'active' : ''}`}
                onClick={() => setReportType('customer')}
              >
                <Search size={14} />
                <span>Customer Search</span>
              </button>
            </div>

          </div>

          {/* Order Status Row */}
          <div style={{
            marginTop: '12px',
            paddingTop: '10px',
            borderTop: '1px dashed #EADBCC',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            flexWrap: 'wrap'
          }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#6C5E53', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Report Order Status:
            </span>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: '#DCFCE7',
              color: '#15803D',
              border: '1.5px solid #86EFAC',
              padding: '4px 12px',
              borderRadius: '8px',
              fontSize: '0.78rem',
              fontWeight: 800
            }}>
              <CheckCircle2 size={14} />
              <span>Completed Orders Only (Delivered & Verified)</span>
            </div>
          </div>

          {/* Sub-filters for Custom Range, Month, Customer */}
          {(reportType === 'range' || reportType === 'month' || reportType === 'customer') && (
            <div className="reports-subfilters-row">
              {reportType === 'range' && (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', flex: 1 }}>
                    <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#5C4E43' }}>From:</label>
                    <input
                      type="date"
                      className="form-input"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      style={{ width: 'auto', minWidth: '150px' }}
                    />
                    <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#5C4E43' }}>To:</label>
                    <input
                      type="date"
                      className="form-input"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      style={{ width: 'auto', minWidth: '150px' }}
                    />
                    <button
                      onClick={loadReport}
                      className="btn btn-primary btn-sm"
                      style={{ background: '#C25E30', borderColor: '#C25E30', fontWeight: 700, borderRadius: '8px' }}
                    >
                      Apply Date Range
                    </button>
                  </div>
                </>
              )}

              {reportType === 'month' && (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', flex: 1 }}>
                    <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#5C4E43' }}>Month:</label>
                    <select
                      className="form-select"
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(e.target.value)}
                      style={{ width: 'auto', minWidth: '140px' }}
                    >
                      {[
                        'January',
                        'February',
                        'March',
                        'April',
                        'May',
                        'June',
                        'July',
                        'August',
                        'September',
                        'October',
                        'November',
                        'December'
                      ].map((m, idx) => (
                        <option key={idx + 1} value={idx + 1}>
                          {m}
                        </option>
                      ))}
                    </select>

                    <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#5C4E43' }}>Year:</label>
                    <select
                      className="form-select"
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(e.target.value)}
                      style={{ width: 'auto', minWidth: '100px' }}
                    >
                      <option value="2026">2026</option>
                      <option value="2025">2025</option>
                    </select>
                  </div>
                </>
              )}

              {reportType === 'customer' && (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', flex: 1 }}>
                    <div style={{ position: 'relative', flex: '1 1 240px', maxWidth: '360px' }}>
                      <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#8A7E74' }} />
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Search student by name, phone or email..."
                        value={customerSearch}
                        onChange={(e) => setCustomerSearch(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && loadReport()}
                        style={{ paddingLeft: '36px' }}
                      />
                    </div>
                    <button
                      onClick={loadReport}
                      className="btn btn-primary btn-sm"
                      style={{ background: '#C25E30', borderColor: '#C25E30', fontWeight: 700, borderRadius: '8px' }}
                    >
                      Search Orders
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* 2. Section Navigation Tabs */}
        <div className="reports-section-nav">
          <button
            type="button"
            className={`reports-nav-tab ${activeSection === 'all' ? 'active' : ''}`}
            onClick={() => setActiveSection('all')}
          >
            <span>All Overview</span>
          </button>

          <button
            type="button"
            className={`reports-nav-tab ${activeSection === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveSection('orders')}
          >
            <ShoppingBag size={14} />
            <span>Orders Log</span>
            <span className="reports-nav-badge">{orders.length}</span>
          </button>
        </div>

        {/* 3. 4 Premium KPI Cards */}
        <div className="reports-kpi-grid">
          {/* Net Collected */}
          <div className="reports-kpi-card" style={{ borderLeft: '4px solid #16A34A' }}>
            <div className="reports-kpi-top">
              <span className="reports-kpi-label">NET REVENUE</span>
              <div className="reports-kpi-icon-wrap" style={{ background: '#DCFCE7', color: '#16A34A' }}>
                <IndianRupee size={16} />
              </div>
            </div>
            <div className="reports-kpi-value" style={{ color: '#16A34A' }}>
              {formatINR(summary.netCollectedPaise)}
            </div>
            <div className="reports-kpi-footer">
              <span>Gross: {formatINR(summary.grossCollectedPaise)}</span>
            </div>
          </div>

          {/* Today's Orders */}
          <div className="reports-kpi-card" style={{ borderLeft: '4px solid #C25E30' }}>
            <div className="reports-kpi-top">
              <span className="reports-kpi-label">{reportType === 'today' ? "TODAY'S ORDERS" : "ORDERS PLACED"}</span>
              <div className="reports-kpi-icon-wrap" style={{ background: '#FAF3ED', color: '#C25E30' }}>
                <Flame size={16} />
              </div>
            </div>
            <div className="reports-kpi-value" style={{ color: '#C25E30' }}>
              {reportType === 'today' ? (summary.todayOrdersCount ?? summary.totalOrders) : summary.totalOrders}
            </div>
            <div className="reports-kpi-footer">
              <span>{totalActiveCombos} meals/combos in selected scope</span>
            </div>
          </div>

          {/* Total Orders Placed */}
          <div className="reports-kpi-card" style={{ borderLeft: '4px solid #2563EB' }}>
            <div className="reports-kpi-top">
              <span className="reports-kpi-label">TOTAL ORDERS</span>
              <div className="reports-kpi-icon-wrap" style={{ background: '#EFF6FF', color: '#2563EB' }}>
                <ShoppingBag size={16} />
              </div>
            </div>
            <div className="reports-kpi-value" style={{ color: '#1E140E' }}>
              {summary.totalOrders}
            </div>
            <div className="reports-kpi-footer">
              <span>{summary.completedOrders} completed • {summary.cancelledOrders} cancelled</span>
            </div>
          </div>

          {/* Kitchen Demand Portions */}
          <div className="reports-kpi-card" style={{ borderLeft: '4px solid #D97706' }}>
            <div className="reports-kpi-top">
              <span className="reports-kpi-label">{reportType === 'today' ? "TODAY'S KITCHEN PREP" : "KITCHEN PREP DEMAND"}</span>
              <div className="reports-kpi-icon-wrap" style={{ background: '#FEF3C7', color: '#D97706' }}>
                <UtensilsCrossed size={16} />
              </div>
            </div>
            <div className="reports-kpi-value" style={{ color: '#D97706' }}>
              {totalActivePortions}
            </div>
            <div className="reports-kpi-footer">
              <span>Portions required for {scopeDetails.periodLabel}</span>
            </div>
          </div>
        </div>

        {/* CATEGORY BREAKDOWN & KITCHEN ITEM PREP COUNTS HIGHLIGHT */}
        <div
          className="reports-section-card"
          style={{
            background: 'linear-gradient(180deg, #FFFFFF 0%, #FFFDF9 100%)',
            border: '1.5px solid #FDBA74',
            boxShadow: '0 4px 16px rgba(194, 65, 12, 0.08)',
            marginBottom: '1.5rem',
            padding: '1.25rem 1.5rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginBottom: '1rem', borderBottom: '1px solid #FED7AA', paddingBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #FFEDD5 0%, #FED7AA 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#C2410C',
                  border: '1px solid #FDBA74'
                }}
              >
                <Flame size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1E140E', margin: 0 }}>
                  {scopeDetails.title}
                </h3>
                <p style={{ fontSize: '0.8rem', color: '#7A6E63', margin: '2px 0 0 0' }}>
                  {scopeDetails.subtitle}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  background: '#DCFCE7',
                  color: '#15803D',
                  border: '1px solid #86EFAC',
                  padding: '4px 10px',
                  borderRadius: '20px',
                  fontSize: '0.76rem',
                  fontWeight: 800,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <CheckCircle2 size={13} />
                <span>
                  {reportType === 'today' ? (summary.todayOrdersCount ?? summary.totalOrders) : summary.totalOrders} Orders Placed
                </span>
              </span>
              <span
                style={{
                  background: '#FEF3C7',
                  color: '#B45309',
                  border: '1px solid #FDE68A',
                  padding: '4px 10px',
                  borderRadius: '20px',
                  fontSize: '0.76rem',
                  fontWeight: 800,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <UtensilsCrossed size={13} />
                <span>{totalActivePortions} Total Portions</span>
              </span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
            {/* 1. Combos Ordered & Constituent Breakdown */}
            <div
              style={{
                background: '#FAF7F2',
                border: '1px solid #EADBCC',
                borderRadius: '12px',
                padding: '1rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <TrendingUp size={16} color="#16A34A" />
                  <span style={{ fontWeight: 800, fontSize: '0.9rem', color: '#1E140E' }}>
                    {scopeDetails.periodLabel} Combos Demanded
                  </span>
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#8A7E74' }}>
                  {activeCombos.length} combos ({totalActiveCombos} total)
                </span>
              </div>

              {activeCombos.length === 0 ? (
                <div style={{ padding: '1rem', textAlign: 'center', color: '#8A7E74', fontSize: '0.85rem' }}>
                  No combo orders placed for {scopeDetails.periodLabel.toLowerCase()} yet.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {activeCombos.map((cs, idx) => (
                    <div
                      key={idx}
                      style={{
                        background: '#FFFFFF',
                        border: '1px solid #EADBCC',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: cs.fixedItems?.length ? '6px' : '0' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span className={`badge ${cs.isVeg ? 'badge-veg' : 'badge-nonveg'}`} style={{ fontSize: '0.68rem', padding: '1px 6px' }}>
                            {cs.isVeg ? 'Veg' : 'Non-Veg'}
                          </span>
                          <span style={{ fontWeight: 800, fontSize: '0.9rem', color: '#1E140E' }}>
                            {cs.name}
                          </span>
                        </div>
                        <span
                          style={{
                            background: '#DCFCE7',
                            color: '#15803D',
                            border: '1px solid #86EFAC',
                            fontWeight: 800,
                            fontSize: '0.82rem',
                            padding: '3px 10px',
                            borderRadius: '12px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <CheckCircle2 size={12} />
                          <span>{cs.demandCount} combo{cs.demandCount > 1 ? 's' : ''}</span>
                        </span>
                      </div>

                      {/* Included Items Breakdown (e.g. 2x Chapathi, 2x Parotta multiplied by combo count) */}
                      {cs.fixedItems && cs.fixedItems.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', paddingTop: '4px', borderTop: '1px dashed #F0E6DA' }}>
                          {cs.fixedItems.map((fi, i) => (
                            <span
                              key={i}
                              style={{
                                background: '#FFF7ED',
                                border: '1px solid #FED7AA',
                                color: '#9A3412',
                                fontSize: '0.72rem',
                                fontWeight: 700,
                                padding: '2px 7px',
                                borderRadius: '6px'
                              }}
                            >
                              {(fi.quantity || 1) * cs.demandCount}x {fi.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 2. Constituent Kitchen Item Name and Count */}
            <div
              style={{
                background: '#FAF7F2',
                border: '1px solid #EADBCC',
                borderRadius: '12px',
                padding: '1rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ChefHat size={16} color="#C2410C" />
                  <span style={{ fontWeight: 800, fontSize: '0.9rem', color: '#1E140E' }}>
                    Kitchen Item Prep Portions
                  </span>
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#8A7E74' }}>
                  {activeItems.length} items ({totalActivePortions} portions)
                </span>
              </div>

              {activeItems.length === 0 ? (
                <div style={{ padding: '1rem', textAlign: 'center', color: '#8A7E74', fontSize: '0.85rem' }}>
                  No kitchen items to prepare for {scopeDetails.periodLabel.toLowerCase()} yet.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {activeItems.map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: '#FFFFFF',
                        border: '1px solid #EADBCC',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <UtensilsCrossed size={14} color="#C25E30" />
                        <span style={{ fontWeight: 700, fontSize: '0.88rem', color: '#1E140E' }}>
                          {item.name}
                        </span>
                      </div>
                      <span
                        style={{
                          background: '#DCFCE7',
                          color: '#15803D',
                          border: '1px solid #86EFAC',
                          fontWeight: 800,
                          fontSize: '0.82rem',
                          padding: '3px 10px',
                          borderRadius: '12px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <CheckCircle2 size={12} />
                        <span>{item.demandCount} portions {scopeDetails.tagLabel}</span>
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 3. Category Name and Count */}
            <div
              style={{
                background: '#FAF7F2',
                border: '1px solid #EADBCC',
                borderRadius: '12px',
                padding: '1rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Layers size={16} color="#2563EB" />
                  <span style={{ fontWeight: 800, fontSize: '0.9rem', color: '#1E140E' }}>
                    {scopeDetails.periodLabel} Category Demand
                  </span>
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#8A7E74' }}>
                  {activeCategories.length} categories
                </span>
              </div>

              {activeCategories.length === 0 ? (
                <div style={{ padding: '1rem', textAlign: 'center', color: '#8A7E74', fontSize: '0.85rem' }}>
                  No category orders placed for {scopeDetails.periodLabel.toLowerCase()} yet.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {activeCategories.map((cat, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: '#FFFFFF',
                        border: '1px solid #EADBCC',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Tag size={14} color="#C25E30" />
                        <span style={{ fontWeight: 700, fontSize: '0.88rem', color: '#1E140E' }}>
                          {cat.name}
                        </span>
                      </div>
                      <span
                        style={{
                          background: '#FFEDD5',
                          color: '#C2410C',
                          border: '1px solid #FDBA74',
                          fontWeight: 800,
                          fontSize: '0.82rem',
                          padding: '3px 10px',
                          borderRadius: '12px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <Flame size={12} />
                        <span>{cat.demandCount} portions</span>
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 3. DETAILED ORDERS AUDIT LOG */}
        {(activeSection === 'all' || activeSection === 'orders') && (
          <div className="reports-section-card">
            <div className="reports-section-header">
              <div className="reports-section-title-wrap">
                <div className="reports-section-icon" style={{ color: '#7C3AED', background: '#FAF5FF', borderColor: '#E9D5FF' }}>
                  <ShoppingBag size={20} />
                </div>
                <div>
                  <h2 className="reports-section-title">Order Records Log</h2>
                  <p className="reports-section-subtitle">
                    Complete transaction logs for selected timeframe ({orders.length} Orders)
                  </p>
                </div>
              </div>
            </div>

            {loading ? (
              <div style={{ padding: '3rem', textAlign: 'center', color: '#7A6E63' }}>
                Loading order records...
              </div>
            ) : orders.length === 0 ? (
              <div style={{ padding: '3rem', textAlign: 'center', color: '#7A6E63' }}>
                No order records found for this period.
              </div>
            ) : (
              <>
                {/* Desktop & Tablet Table */}
                <div className="table-responsive reports-desktop-table" style={{ border: 'none' }}>
                  <table className="categories-data-table">
                    <thead>
                      <tr>
                        <th>Order #</th>
                        <th>Pickup Date</th>
                        <th>Placed At</th>
                        <th>Customer</th>
                        <th>Combos Ordered</th>
                        <th style={{ textAlign: 'right' }}>Subtotal</th>
                        <th style={{ textAlign: 'right' }}>Tax</th>
                        <th style={{ textAlign: 'right' }}>Total (₹)</th>
                        <th>Order Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((o) => (
                        <tr key={o._id}>
                          <td style={{ fontWeight: 800 }}>#{o.orderNumber}</td>
                          <td>
                            <span
                              style={{
                                display: 'inline-block',
                                background: '#FFF7ED',
                                border: '1px solid #FED7AA',
                                color: '#C2410C',
                                fontWeight: 700,
                                fontSize: '0.76rem',
                                padding: '2px 8px',
                                borderRadius: '6px'
                              }}
                            >
                              {o.pickupDate || 'Today'}
                            </span>
                          </td>
                          <td style={{ fontSize: '0.8rem', color: '#7A6E63' }}>
                            {formatKolkataTime(o.createdAt)}
                          </td>
                          <td>
                            <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>{o.customerSnapshot?.name}</div>
                            <div style={{ fontSize: '0.75rem', color: '#8A7E74' }}>{o.customerSnapshot?.phone}</div>
                          </td>
                          <td style={{ fontSize: '0.84rem' }}>
                            {o.items?.map((i, idx) => (
                              <div key={idx} style={{ lineHeight: 1.35 }}>
                                <span style={{ fontWeight: 700, color: '#C25E30' }}>{i.quantity}x</span> {i.name}
                              </div>
                            ))}
                          </td>
                          <td style={{ textAlign: 'right', fontSize: '0.88rem', color: '#5C5046' }}>
                            {formatINR(o.subtotalPaise)}
                          </td>
                          <td style={{ textAlign: 'right', fontSize: '0.88rem', color: '#7A6E63' }}>
                            {formatINR(o.taxPaise || 0)}
                          </td>
                          <td style={{ textAlign: 'right', fontWeight: 800, fontSize: '0.94rem', color: '#1E140E' }}>
                            {formatINR(o.totalPaise)}
                          </td>
                          <td>
                            <span className="badge badge-status-completed">{o.orderStatus}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards Grid (<768px) */}
                <div className="reports-mobile-cards">
                  {orders.map((o) => (
                    <div key={o._id} className="reports-item-card">
                      <div className="reports-item-card-top">
                        <div>
                          <div style={{ fontWeight: 800, fontSize: '1rem', color: '#1E140E' }}>
                            #{o.orderNumber}
                          </div>
                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '3px' }}>
                            <span
                              style={{
                                background: '#FFF7ED',
                                border: '1px solid #FED7AA',
                                color: '#C2410C',
                                fontWeight: 700,
                                fontSize: '0.72rem',
                                padding: '1px 6px',
                                borderRadius: '4px'
                              }}
                            >
                              Pickup: {o.pickupDate || 'Today'}
                            </span>
                            <span style={{ fontSize: '0.74rem', color: '#8A7E74' }}>
                              {formatKolkataTime(o.createdAt)}
                            </span>
                          </div>
                        </div>

                        <div style={{ textAlign: 'right' }}>
                          <span
                            className="badge badge-status-completed"
                            style={{ fontSize: '0.7rem' }}
                          >
                            {o.orderStatus}
                          </span>
                        </div>
                      </div>

                      {/* Customer Info */}
                      <div style={{ fontSize: '0.82rem', color: '#5C4E43' }}>
                        Customer: <strong style={{ color: '#1E140E' }}>{o.customerSnapshot?.name}</strong>{' '}
                        {o.customerSnapshot?.phone && `(${o.customerSnapshot.phone})`}
                      </div>

                      {/* Items */}
                      <div style={{ background: '#FFFFFF', padding: '8px 10px', borderRadius: '8px', border: '1px solid #EADBCC' }}>
                        {o.items?.map((i, idx) => (
                          <div key={idx} style={{ fontSize: '0.82rem', lineHeight: 1.4 }}>
                            <strong style={{ color: '#C25E30' }}>{i.quantity}x</strong> {i.name}
                          </div>
                        ))}
                      </div>

                      {/* Financial Breakdown (Subtotal, Tax, Total in Rs.) */}
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingTop: '6px',
                        borderTop: '1px dashed #EADBCC',
                        fontSize: '0.82rem'
                      }}>
                        <div style={{ color: '#7A6E63' }}>
                          Subtotal: <strong>{formatINR(o.subtotalPaise)}</strong> • Tax: <strong>{formatINR(o.taxPaise || 0)}</strong>
                        </div>
                        <div style={{ fontWeight: 800, fontSize: '0.96rem', color: '#1E140E' }}>
                          Total: <span style={{ color: '#C25E30' }}>{formatINR(o.totalPaise)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
