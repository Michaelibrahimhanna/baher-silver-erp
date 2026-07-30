/**
 * BAHER SILVER ERP v2.0 — UI Behaviors
 * Sidebar | Theme | Language | Search | Notifications | Counters
 * Does NOT touch app.js data logic
 */

/* ═══════════════════════════════════════════════════════════════
   TRANSLATIONS — Full AR/EN coverage
   ═══════════════════════════════════════════════════════════════ */
const T = {
  en: {
    // Nav
    nav_main:'MAIN', nav_management:'MANAGEMENT',
    nav_dashboard:'Dashboard', nav_inventory:'Gemstone Inventory',
    nav_movements:'Stock Movement', nav_search:'Advanced Search',
    nav_suppliers:'Suppliers', nav_barcode:'Barcode & QR',
    nav_reports:'Reports', nav_settings:'Settings',
    nav_collapse:'Collapse sidebar', nav_expand:'Expand sidebar',
    // Topbar
    search_placeholder:'Search stones, barcodes, suppliers…',
    search_hint:'⌘K', search_empty:'No results found',

    // Wholesale
    col_grams:'Grams', f_grams:'Weight (Grams)', kpi_grams:'Total Grams',
    f_pieces:'Pieces', pieces:'pcs',
    // Dynamic Dropdowns
    "diamond": "Diamond", "ruby": "Ruby", "emerald": "Emerald", "sapphire": "Sapphire", "pearl": "Pearl", "opal": "Opal", "topaz": "Topaz", "amethyst": "Amethyst", "garnet": "Garnet", "turquoise": "Turquoise",
    "natural": "Natural", "synthetic": "Synthetic", "treated": "Treated", "lab-grown": "Lab-Grown", "simulant": "Simulant",
    "white": "White", "red": "Red", "pink": "Pink", "blue": "Blue", "green": "Green", "yellow": "Yellow", "orange": "Orange", "purple": "Purple", "black": "Black", "brown": "Brown", "gray": "Gray", "colorless": "Colorless", "multi-color": "Multi-Color",
    "round": "Round", "oval": "Oval", "pear": "Pear", "marquise": "Marquise", "princess": "Princess", "cushion": "Cushion", "emerald cut": "Emerald Cut", "asscher": "Asscher", "radiant": "Radiant", "heart": "Heart", "trillion": "Trillion", "baguette": "Baguette", "cabochon": "Cabochon", "freeform": "Freeform",
    "brilliant": "Brilliant", "step": "Step", "mixed": "Mixed", "rose": "Rose", "briolette": "Briolette", "faceted": "Faceted", "smooth": "Smooth",
    "carat": "Carat", "piece": "Piece", "gram": "Gram", "set": "Set", "pair": "Pair", "lot": "Lot",

    search_tip_enter:'to select', search_tip_esc:'to close',
    notif_title:'Notifications', notif_empty:'All caught up!',
    notif_empty_sub:'No alerts at the moment',
    notif_mark_read:'Mark all as read',
    notif_low_stock:'Low Stock Alert',
    notif_out_stock:'Out of Stock',
    theme_dark:'Dark mode', theme_light:'Light mode',
    user_name:'Administrator', user_role:'System Admin',
    user_profile:'Profile', user_settings:'Settings', user_logout:'Sign out',
    quick_add:'New Stone',
    // Page titles
    page_dashboard:'Dashboard', page_inventory:'Gemstone Inventory',
    page_movements:'Stock Movement', page_search:'Advanced Search',
    page_suppliers:'Suppliers', page_barcode:'Barcode & QR',
    page_reports:'Reports & Analytics', page_settings:'Settings',
    // Dashboard
    dash_subtitle:'Gemstone inventory overview',
    kpi_inv_value:'Inventory Value', kpi_purchase:'Purchase Value',
    kpi_selling:'Selling Value', kpi_profit:'Gross Profit',
    kpi_types:'Stone Types', kpi_qty:'Total Quantity',
    kpi_low:'Low Stock', kpi_out:'Out of Stock',
    chart_monthly:'Monthly Stock Movement',
    chart_category:'By Category', chart_color:'By Color',
    chart_shape:'By Shape', chart_supplier:'By Supplier',
    top_stones:'Top Stones by Value', recent_tx:'Recent Transactions',
    stock_alerts:'Stock Alerts', view_all:'View All',
    today_movements:"Today's Movements",
    // Table
    col_image:'Image', col_code:'Stone ID', col_name:'Stone Name',
    col_category:'Category', col_type:'Type', col_color:'Color',
    col_shape:'Shape', col_cut:'Cut', col_size:'Size (mm)',
    col_weight:'Weight (ct)', col_qty:'Quantity', col_unit:'Unit',
    col_buy:'Buy Price', col_sell:'Sell Price', col_value:'Total Value',
    col_status:'Status', col_location:'Location', col_supplier:'Supplier',
    col_date:'Date Added', col_actions:'Actions',
    // Movements
    col_mov_id:'Movement ID', col_mov_date:'Date & Time',
    col_mov_stone:'Stone', col_tx_type:'Type', col_employee:'Employee',
    col_reference:'Reference', col_reason:'Reason',
    // Status
    status_in:'In Stock', status_low:'Low Stock', status_out:'Out of Stock',
    tx_in:'Stock In', tx_out:'Stock Out', tx_adj:'Adjustment', tx_return:'Return',
    // Actions
    btn_add:'Add Gemstone', btn_edit:'Edit', btn_delete:'Delete',
    btn_view:'View', btn_barcode:'Barcode', btn_save:'Save',
    btn_cancel:'Cancel', btn_export:'Export CSV', btn_import:'Import',
    btn_print:'Print', btn_close:'Close', btn_confirm:'Confirm',
    btn_clear:'Clear', btn_search:'Search', btn_new_mov:'New Movement',
    btn_add_supplier:'Add Supplier', btn_refresh:'Refresh',
    btn_add_stone:'Add Stone', btn_bulk_delete:'Delete Selected',
    btn_select_all:'Select All', btn_deselect:'Deselect',
    // Form fields
    f_name_en:'Stone Name (English)', f_name_ar:'Stone Name (Arabic)',
    f_category:'Category', f_type:'Stone Type', f_color:'Color',
    f_shape:'Shape', f_cut:'Cut', f_size:'Size (mm)', f_weight:'Weight (Carat)',
    f_qty:'Quantity Available', f_unit:'Unit', f_min_stock:'Min. Stock Level',
    f_buy_price:'Purchase Price', f_sell_price:'Selling Price',
    f_margin:'Profit Margin', f_supplier:'Supplier', f_location:'Storage Location',
    f_notes:'Notes', f_image:'Stone Image', f_barcode:'Barcode',
    f_barcode_auto:'Auto-generated on save',
    // Placeholders
    ph_name_en:'e.g. Round White Diamond',
    ph_name_ar:'مثال: ألماس أبيض دائري',
    ph_size:'e.g. 3.5', ph_weight:'e.g. 0.25',
    ph_qty:'0', ph_min:'10', ph_price:'0.00',
    ph_notes:'Additional information…',
    ph_search:'Search by name, code, barcode…',
    ph_reason:'e.g. Customer order, Production…',
    ph_reference:'e.g. PO-2024-001',
    // Validation
    err_required:'This field is required',
    err_positive:'Must be a positive number',
    err_duplicate:'Duplicate entry detected',
    err_neg_stock:'Insufficient stock for this operation',
    err_invalid:'Invalid value',
    // Success messages
    msg_added:'Record added successfully',
    msg_updated:'Record updated successfully',
    msg_deleted:'Record deleted',
    msg_exported:'Exported successfully',
    msg_imported:'Imported successfully',
    msg_saved:'Settings saved',
    // Confirms
    confirm_delete:'Are you sure you want to delete this record? This action cannot be undone.',
    confirm_reset:'This will reset ALL data to demo data. This cannot be undone!',
    // Movement form
    f_stone:'Select Stone', f_tx_type:'Transaction Type',
    f_mov_date:'Date', f_mov_time:'Time',
    ph_stone_search:'Search by name, code or barcode…',
    ph_employee:'Select employee',
    label_current_qty:'Current Stock', label_after_qty:'After Movement',
    // Supplier fields
    f_company:'Company Name', f_contact:'Contact Person',
    f_mobile:'Mobile', f_whatsapp:'WhatsApp', f_email:'Email',
    f_website:'Website', f_country:'Country', f_address:'Address',
    // Search
    search_title:'Advanced Search', search_subtitle:'Find any gemstone instantly',
    scan_hint:'Scan a barcode or QR code directly into the search box',
    filter_status:'Stock Status', filter_all:'All', filter_in:'In Stock',
    filter_low:'Low Stock', filter_out:'Out of Stock',
    min_qty:'Min Qty', max_qty:'Max Qty',
    results_found:'gemstone(s) found',
    no_results:'No gemstones match your search',
    try_search:'Start searching to find gemstones',
    // Reports
    tab_valuation:'Inventory Valuation', tab_stock:'Stock Summary',
    tab_movements:'Movement Report', tab_alerts:'Stock Alerts',
    col_buy_total:'Total Buy', col_sell_total:'Total Sell', col_margin:'Margin',
    total_purchase:'Total Purchase Value', total_selling:'Total Selling Value',
    gross_profit:'Gross Profit', avg_margin:'Avg. Margin',
    alerts_low:'Low Stock Items', alerts_out:'Out of Stock Items',
    all_healthy:'All stocks are healthy',
    no_alerts:'No alerts at the moment',
    date_from:'From Date', date_to:'To Date',
    // Settings
    set_general:'General', set_categories:'Categories',
    set_types:'Stone Types', set_colors:'Colors', set_shapes:'Shapes',
    set_cuts:'Cuts', set_units:'Units', set_employees:'Employees',
    set_locations:'Locations', set_alerts_s:'Alerts & Currency',
    set_data:'Data Management',
    set_company_en:'Company Name (English)', set_company_ar:'Company Name (Arabic)',
    set_min_stock:'Minimum Stock Alert Level',
    set_min_hint:'Stones at or below this quantity will trigger alerts',
    set_currency:'Currency', set_save_general:'Save General Settings',
    set_save_alerts:'Save Alert Settings',
    set_export_title:'Export All Data', set_export_desc:'Export all data as JSON backup',
    set_export_btn:'Export Backup', set_import_title:'Import Data',
    set_import_desc:'Import a previously exported JSON backup',
    set_import_btn:'Import JSON', set_danger_title:'Danger Zone',
    set_danger_desc:'Reset all data to demo data. Cannot be undone.',
    set_reset_btn:'Reset All Data', set_sysinfo:'System Information',
    add_item:'Add', edit_item:'Edit', del_item:'Delete',
    item_placeholder:'Type and press Enter or click Add',
    // Barcode
    bc_scanner:'Scanner', bc_scan_hint:'Scan barcode or enter code manually',
    bc_mode_bc:'Barcode', bc_mode_qr:'QR Code', bc_mode_both:'Both',
    bc_filter_cat:'All Categories', bc_download:'Download',
    bc_print:'Print', bc_not_found:'No stone found with this code',
    // Empty states
    empty_inventory:'No gemstones yet', empty_inv_desc:'Add your first gemstone to get started',
    empty_movements:'No movements recorded', empty_mov_desc:'Record your first stock movement',
    empty_search:'No results', empty_search_desc:'Try adjusting your search terms',
    empty_suppliers:'No suppliers yet', empty_sup_desc:'Add your first supplier',
    empty_notif:'All caught up!', empty_notif_desc:'No alerts right now',
    // Misc
    today:'Today', yesterday:'Yesterday', just_now:'Just now',
    currency_egp:'EGP', powered_by:'Baher Silver ERP v2.0',
    page_of:'of', rows_per_page:'Rows per page',
    selected_items:'selected', loading:'Loading…',
    confirm_title:'Confirm Action',
    bc_title:'Barcode & QR Code Studio',
    bc_subtitle:'Generate, print and scan gemstone labels',
    // newly added
    brand_name:'Baher Silver', brand_desc:'GEMSTONE ERP',
    btn_filters:'Filters', sort_name_asc:'Name (A-Z)', sort_date_desc:'Newest First', sort_price_desc:'Highest Price',
    modal_tab_identity:'Identity', modal_tab_physical:'Physical', modal_tab_pricing:'Pricing & Stock',
    profit_label:'Profit:', dropzone_main:'Click to upload or drag & drop', dropzone_sub:'PNG, JPG, WEBP — max 5MB',
    select_default:'— Select —', select_none:'— None —', units_total:'units total', stone_types:'stone types',
    kpi_margin:'margin', latest_tx_units:'units', total_movements:'total movements', net_change:'Net Change',
    manage_suppliers:'Manage', supplier_accounts:'supplier accounts', label_generator:'Label Generator',
    displaying_up_to:'Displaying up to 50 stones for printing.', comprehensive_analysis:'Comprehensive data analysis',
    value_by_category:'Value by Category', avg_qty_type:'Avg Qty per Type', dist_shape:'Distribution by Shape', dist_color:'Distribution by Color',
    user_avatar:'A', f_buy:'Buy Price', f_sell:'Sell Price', modal_stone:'Stone Details', confirm_del_msg:'Are you sure?',
    no_data:'No data available', all_healthy:'All stocks are healthy', no_alerts:'No alerts at the moment'
  },
  ar: {
    // Nav
    nav_main:'الرئيسية', nav_management:'الإدارة',
    nav_dashboard:'لوحة التحكم', nav_inventory:'مخزون الأحجار الكريمة',
    nav_movements:'حركة المخزون', nav_search:'البحث المتقدم',
    nav_suppliers:'الموردون', nav_barcode:'الباركود والـ QR',
    nav_reports:'التقارير', nav_settings:'الإعدادات',
    nav_collapse:'طي الشريط الجانبي', nav_expand:'توسيع الشريط الجانبي',
    // Topbar
    search_placeholder:'ابحث عن أحجار، باركود، موردين…',
    search_hint:'بحث', search_empty:'لا توجد نتائج',

    // Wholesale
    col_grams:'جرام', f_grams:'الوزن (جرام)', kpi_grams:'إجمالي الجرامات',
    f_pieces:'القطع', pieces:'قطعة',
    // Dynamic Dropdowns
    "diamond": "ألماس", "ruby": "ياقوت أحمر", "emerald": "زمرد", "sapphire": "ياقوت أزرق", "pearl": "لؤلؤ", "opal": "أوبال", "topaz": "توباز", "amethyst": "جمشت", "garnet": "عقيق", "turquoise": "فيروز",
    "natural": "طبيعي", "synthetic": "صناعي", "treated": "معالج", "lab-grown": "مزروع بالمختبر", "simulant": "مقلد",
    "white": "أبيض", "red": "أحمر", "pink": "وردي", "blue": "أزرق", "green": "أخضر", "yellow": "أصفر", "orange": "برتقالي", "purple": "بنفسجي", "black": "أسود", "brown": "بني", "gray": "رمادي", "colorless": "عديم اللون", "multi-color": "متعدد الألوان",
    "round": "دائري", "oval": "بيضاوي", "pear": "كمثري", "marquise": "ماركيز", "princess": "أميرة", "cushion": "وسادي", "emerald cut": "زمردي", "asscher": "آشر", "radiant": "مشع", "heart": "قلب", "trillion": "تريليون", "baguette": "باجيت", "cabochon": "كابوشون", "freeform": "شكل حر",
    "brilliant": "لامع", "step": "متدرج", "mixed": "مختلط", "rose": "وردي", "briolette": "بريوليت", "faceted": "مضلع", "smooth": "أملس",
    "carat": "قيراط", "piece": "قطعة", "gram": "جرام", "set": "طقم", "pair": "زوج", "lot": "لوط",

    search_tip_enter:'للاختيار', search_tip_esc:'للإغلاق',
    notif_title:'الإشعارات', notif_empty:'لا توجد إشعارات!',
    notif_empty_sub:'لا توجد تنبيهات في الوقت الحالي',
    notif_mark_read:'تحديد الكل كمقروء',
    notif_low_stock:'تنبيه مخزون منخفض',
    notif_out_stock:'نفاد المخزون',
    theme_dark:'الوضع الداكن', theme_light:'الوضع الفاتح',
    user_name:'المسؤول', user_role:'مدير النظام',
    user_profile:'الملف الشخصي', user_settings:'الإعدادات', user_logout:'تسجيل الخروج',
    quick_add:'حجر جديد',
    // Page titles
    page_dashboard:'لوحة التحكم', page_inventory:'مخزون الأحجار الكريمة',
    page_movements:'حركة المخزون', page_search:'البحث المتقدم',
    page_suppliers:'الموردون', page_barcode:'الباركود والـ QR',
    page_reports:'التقارير والتحليلات', page_settings:'الإعدادات',
    // Dashboard
    dash_subtitle:'نظرة عامة على مخزون الأحجار الكريمة',
    kpi_inv_value:'قيمة المخزون', kpi_purchase:'قيمة الشراء',
    kpi_selling:'قيمة البيع', kpi_profit:'إجمالي الربح',
    kpi_types:'أنواع الأحجار', kpi_qty:'الكمية الإجمالية',
    kpi_low:'مخزون منخفض', kpi_out:'نفاد المخزون',
    chart_monthly:'حركة المخزون الشهرية',
    chart_category:'حسب الفئة', chart_color:'حسب اللون',
    chart_shape:'حسب الشكل', chart_supplier:'حسب المورد',
    top_stones:'أعلى الأحجار قيمة', recent_tx:'آخر المعاملات',
    stock_alerts:'تنبيهات المخزون', view_all:'عرض الكل',
    today_movements:'حركات اليوم',
    // Table
    col_image:'الصورة', col_code:'رقم الحجر', col_name:'اسم الحجر',
    col_category:'الفئة', col_type:'النوع', col_color:'اللون',
    col_shape:'الشكل', col_cut:'القطع', col_size:'الحجم (مم)',
    col_weight:'الوزن (قيراط)', col_qty:'الكمية', col_unit:'الوحدة',
    col_buy:'سعر الشراء', col_sell:'سعر البيع', col_value:'القيمة الإجمالية',
    col_status:'الحالة', col_location:'موقع التخزين', col_supplier:'المورد',
    col_date:'تاريخ الإضافة', col_actions:'الإجراءات',
    // Movements
    col_mov_id:'رقم الحركة', col_mov_date:'التاريخ والوقت',
    col_mov_stone:'الحجر', col_tx_type:'نوع المعاملة', col_employee:'الموظف',
    col_reference:'المرجع', col_reason:'السبب',
    // Status
    status_in:'متوفر', status_low:'مخزون منخفض', status_out:'نفاد المخزون',
    tx_in:'وارد', tx_out:'صادر', tx_adj:'تعديل', tx_return:'مرتجع',
    // Actions
    btn_add:'إضافة حجر', btn_edit:'تعديل', btn_delete:'حذف',
    btn_view:'عرض', btn_barcode:'باركود', btn_save:'حفظ',
    btn_cancel:'إلغاء', btn_export:'تصدير CSV', btn_import:'استيراد',
    btn_print:'طباعة', btn_close:'إغلاق', btn_confirm:'تأكيد',
    btn_clear:'مسح', btn_search:'بحث', btn_new_mov:'حركة جديدة',
    btn_add_supplier:'إضافة مورد', btn_refresh:'تحديث',
    btn_add_stone:'إضافة حجر', btn_bulk_delete:'حذف المحدد',
    btn_select_all:'تحديد الكل', btn_deselect:'إلغاء التحديد',
    // Form fields
    f_name_en:'اسم الحجر (الإنجليزية)', f_name_ar:'اسم الحجر (العربية)',
    f_category:'الفئة', f_type:'نوع الحجر', f_color:'اللون',
    f_shape:'الشكل', f_cut:'القطع', f_size:'الحجم (مم)', f_weight:'الوزن (قيراط)',
    f_qty:'الكمية المتاحة', f_unit:'الوحدة', f_min_stock:'الحد الأدنى للمخزون',
    f_buy_price:'سعر الشراء', f_sell_price:'سعر البيع',
    f_margin:'هامش الربح', f_supplier:'المورد', f_location:'موقع التخزين',
    f_notes:'ملاحظات', f_image:'صورة الحجر', f_barcode:'الباركود',
    f_barcode_auto:'يُولَّد تلقائياً عند الحفظ',
    // Placeholders
    ph_name_en:'مثال: Round White Diamond',
    ph_name_ar:'مثال: ألماس أبيض دائري',
    ph_size:'مثال: 3.5', ph_weight:'مثال: 0.25',
    ph_qty:'0', ph_min:'10', ph_price:'0.00',
    ph_notes:'معلومات إضافية…',
    ph_search:'ابحث بالاسم أو الرمز أو الباركود…',
    ph_reason:'مثال: طلب عميل، إنتاج…',
    ph_reference:'مثال: PO-2024-001',
    // Validation
    err_required:'هذا الحقل مطلوب',
    err_positive:'يجب أن يكون رقماً موجباً',
    err_duplicate:'تم اكتشاف إدخال مكرر',
    err_neg_stock:'رصيد غير كافٍ لهذه العملية',
    err_invalid:'قيمة غير صحيحة',
    // Success messages
    msg_added:'تمت الإضافة بنجاح',
    msg_updated:'تم التحديث بنجاح',
    msg_deleted:'تم الحذف',
    msg_exported:'تم التصدير بنجاح',
    msg_imported:'تم الاستيراد بنجاح',
    msg_saved:'تم حفظ الإعدادات',
    // Confirms
    confirm_delete:'هل أنت متأكد من حذف هذا السجل؟ لا يمكن التراجع عن هذا الإجراء.',
    confirm_reset:'سيؤدي هذا إلى إعادة ضبط جميع البيانات. لا يمكن التراجع!',
    // Movement form
    f_stone:'اختر الحجر', f_tx_type:'نوع المعاملة',
    f_mov_date:'التاريخ', f_mov_time:'الوقت',
    ph_stone_search:'ابحث بالاسم أو الرمز أو الباركود…',
    ph_employee:'اختر الموظف',
    label_current_qty:'الكمية الحالية', label_after_qty:'بعد الحركة',
    // Supplier fields
    f_company:'اسم الشركة', f_contact:'جهة الاتصال',
    f_mobile:'الجوال', f_whatsapp:'واتساب', f_email:'البريد الإلكتروني',
    f_website:'الموقع الإلكتروني', f_country:'الدولة', f_address:'العنوان',
    // Search
    search_title:'البحث المتقدم', search_subtitle:'ابحث عن أي حجر بسرعة',
    scan_hint:'امسح الباركود أو رمز QR مباشرة في مربع البحث',
    filter_status:'حالة المخزون', filter_all:'الكل', filter_in:'متوفر',
    filter_low:'مخزون منخفض', filter_out:'نفاد المخزون',
    min_qty:'الحد الأدنى', max_qty:'الحد الأقصى',
    results_found:'حجر(أحجار) موجودة',
    no_results:'لا توجد أحجار تطابق بحثك',
    try_search:'ابدأ البحث للعثور على الأحجار',
    // Reports
    tab_valuation:'تقييم المخزون', tab_stock:'ملخص المخزون',
    tab_movements:'تقرير الحركة', tab_alerts:'تنبيهات المخزون',
    col_buy_total:'إجمالي الشراء', col_sell_total:'إجمالي البيع', col_margin:'الهامش',
    total_purchase:'إجمالي قيمة الشراء', total_selling:'إجمالي قيمة البيع',
    gross_profit:'إجمالي الربح', avg_margin:'متوسط الهامش',
    alerts_low:'أصناف منخفضة المخزون', alerts_out:'أصناف نافدة المخزون',
    all_healthy:'جميع المخزونات سليمة',
    no_alerts:'لا توجد تنبيهات في الوقت الحالي',
    date_from:'من تاريخ', date_to:'إلى تاريخ',
    // Settings
    set_general:'عام', set_categories:'الفئات',
    set_types:'أنواع الأحجار', set_colors:'الألوان', set_shapes:'الأشكال',
    set_cuts:'أنواع القطع', set_units:'الوحدات', set_employees:'الموظفون',
    set_locations:'مواقع التخزين', set_alerts_s:'التنبيهات والعملة',
    set_data:'إدارة البيانات',
    set_company_en:'اسم الشركة (الإنجليزية)', set_company_ar:'اسم الشركة (العربية)',
    set_min_stock:'مستوى تنبيه الحد الأدنى للمخزون',
    set_min_hint:'الأحجار التي تصل إلى هذه الكمية أو أقل ستثير تنبيهات',
    set_currency:'العملة', set_save_general:'حفظ الإعدادات العامة',
    set_save_alerts:'حفظ إعدادات التنبيهات',
    set_export_title:'تصدير جميع البيانات', set_export_desc:'تصدير جميع البيانات كنسخة احتياطية JSON',
    set_export_btn:'تصدير النسخة الاحتياطية', set_import_title:'استيراد البيانات',
    set_import_desc:'استيراد نسخة احتياطية JSON تم تصديرها مسبقاً',
    set_import_btn:'استيراد JSON', set_danger_title:'منطقة الخطر',
    set_danger_desc:'إعادة ضبط جميع البيانات. لا يمكن التراجع.',
    set_reset_btn:'إعادة ضبط الكل', set_sysinfo:'معلومات النظام',
    add_item:'إضافة', edit_item:'تعديل', del_item:'حذف',
    item_placeholder:'اكتب ثم اضغط Enter أو انقر إضافة',
    // Barcode
    bc_scanner:'الماسح الضوئي', bc_scan_hint:'امسح الباركود أو أدخل الرمز يدوياً',
    bc_mode_bc:'الباركود', bc_mode_qr:'رمز QR', bc_mode_both:'كلاهما',
    bc_filter_cat:'جميع الفئات', bc_download:'تنزيل',
    bc_print:'طباعة', bc_not_found:'لم يتم العثور على حجر بهذا الرمز',
    // Empty states
    empty_inventory:'لا توجد أحجار بعد', empty_inv_desc:'أضف حجرك الأول للبدء',
    empty_movements:'لا توجد حركات مسجلة', empty_mov_desc:'سجّل أول حركة مخزون',
    empty_search:'لا توجد نتائج', empty_search_desc:'جرب تعديل معايير البحث',
    empty_suppliers:'لا يوجد موردون بعد', empty_sup_desc:'أضف المورد الأول',
    empty_notif:'لا توجد إشعارات!', empty_notif_desc:'لا توجد تنبيهات حالياً',
    // Misc
    today:'اليوم', yesterday:'أمس', just_now:'الآن',
    currency_egp:'ج.م', powered_by:'باهر سيلفر - نظام ERP v2.0',
    page_of:'من', rows_per_page:'صفوف في الصفحة',
    selected_items:'محدد', loading:'جارٍ التحميل…',
    confirm_title:'تأكيد الإجراء',
    bc_title:'استوديو الباركود ورمز QR',
    bc_subtitle:'توليد وطباعة ومسح ملصقات الأحجار الكريمة',
    // newly added
    brand_name:'باهر سيلفر', brand_desc:'نظام الأحجار الكريمة',
    btn_filters:'التصفيات', sort_name_asc:'الاسم (أ-ي)', sort_date_desc:'الأحدث أولاً', sort_price_desc:'الأعلى سعراً',
    modal_tab_identity:'الهوية', modal_tab_physical:'المواصفات', modal_tab_pricing:'التسعير والمخزون',
    profit_label:'الربح:', dropzone_main:'انقر للرفع أو اسحب وأفلت', dropzone_sub:'أقصى حجم 5 ميجابايت',
    select_default:'— اختر —', select_none:'— لا يوجد —', units_total:'وحدة إجمالاً', stone_types:'أنواع أحجار',
    kpi_margin:'هامش', latest_tx_units:'وحدة', total_movements:'إجمالي الحركات', net_change:'صافي التغيير',
    manage_suppliers:'إدارة', supplier_accounts:'حسابات موردين', label_generator:'مولد الملصقات',
    displaying_up_to:'يتم عرض ما يصل إلى 50 حجراً للطباعة.', comprehensive_analysis:'تحليل بيانات شامل',
    value_by_category:'القيمة حسب الفئة', avg_qty_type:'متوسط الكمية للنوع', dist_shape:'التوزيع حسب الشكل', dist_color:'التوزيع حسب اللون',
    user_avatar:'أ', f_buy:'سعر الشراء', f_sell:'سعر البيع', modal_stone:'تفاصيل الحجر', confirm_del_msg:'هل أنت متأكد؟',
    no_data:'لا توجد بيانات', all_healthy:'جميع المخزونات سليمة', no_alerts:'لا توجد تنبيهات في الوقت الحالي'
  }
};

/* ═══════════════════════════════════════════════════════════════
   STATE
   ═══════════════════════════════════════════════════════════════ */
const UI = {
  lang: localStorage.getItem('bs_lang') || 'en',
  theme: localStorage.getItem('bs_theme') || 'dark',
  sidebarCollapsed: localStorage.getItem('bs_sidebar') === 'true',

  t(key) {
    if (!key) return '';
    const k = String(key).toLowerCase();
    return T[this.lang]?.[k] || T[this.lang]?.[key] || T.en[key] || key;
  },

  /* ── Theme ── */
  applyTheme(theme) {
    this.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('bs_theme', theme);
    const btn = document.getElementById('theme-btn');
    if (btn) {
      btn.innerHTML = theme === 'dark'
        ? '<svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>'
        : '<svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>';
      btn.title = this.t(theme === 'dark' ? 'theme_light' : 'theme_dark');
    }
  },
  toggleTheme() {
    this.applyTheme(this.theme === 'dark' ? 'light' : 'dark');
  },

  /* ── Language ── */
  applyLang(lang) {
    this.lang = lang;
    localStorage.setItem('bs_lang', lang);
    const isAr = lang === 'ar';
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('dir', isAr ? 'rtl' : 'ltr');
    document.body.classList.toggle('lang-ar', isAr);
    // Font
    document.body.style.fontFamily = isAr ? "'Cairo', 'Tajawal', sans-serif" : "'Inter', sans-serif";
    // Update all i18n elements
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      el.textContent = this.t(key);
    });
    document.querySelectorAll('[data-i18n-ph]').forEach(el => {
      el.placeholder = this.t(el.getAttribute('data-i18n-ph'));
    });
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
      el.title = this.t(el.getAttribute('data-i18n-title'));
    });
    // Language buttons
    document.querySelectorAll('.lang-btn, .lang-toggle-topbar').forEach(btn => {
      if (btn.dataset.lang) btn.classList.toggle('active', btn.dataset.lang === lang);
    });
    document.querySelectorAll('.lang-toggle-topbar').forEach(btn => {
      btn.textContent = lang === 'ar' ? 'ع' : 'EN';
    });
    // Update theme tooltip
    this.applyTheme(this.theme);
  },
  toggleLang() {
    this.applyLang(this.lang === 'ar' ? 'en' : 'ar');
  },

  /* ── Sidebar ── */
  applySidebar(collapsed) {
    this.sidebarCollapsed = collapsed;
    localStorage.setItem('bs_sidebar', collapsed);
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;
    sidebar.classList.toggle('collapsed', collapsed);
    const btn = document.getElementById('collapse-btn');
    if (btn) {
      btn.title = this.t(collapsed ? 'nav_expand' : 'nav_collapse');
      btn.querySelector('[data-lucide]')?.setAttribute('data-lucide', collapsed ? 'panel-left-open' : 'panel-left-close');
      if (window.lucide) lucide.createIcons({ nodes: [btn] });
    }
  },
  toggleSidebar() {
    this.applySidebar(!this.sidebarCollapsed);
  },
  openMobileSidebar() {
    document.getElementById('sidebar')?.classList.add('mobile-open');
    document.getElementById('sidebar-overlay')?.classList.add('visible');
  },
  closeMobileSidebar() {
    document.getElementById('sidebar')?.classList.remove('mobile-open');
    document.getElementById('sidebar-overlay')?.classList.remove('visible');
  },

  /* ── Active Nav ── */
  setActivePage() {
    const page = window.location.pathname.split('/').pop().replace('.html', '') || 'index';
    document.querySelectorAll('.nav-item[data-page]').forEach(el => {
      el.classList.toggle('active', el.dataset.page === page);
    });
    // Update nav badge
    this.updateNavBadges();
  },
  updateNavBadges() {
    if (typeof DB === 'undefined') return;
    const stats = DB.getStats();
    const count = stats.low_stock + stats.out_of_stock;
    document.querySelectorAll('#low-stock-badge').forEach(b => {
      b.textContent = count;
      b.classList.toggle('hidden', count === 0);
    });
  },

  /* ── Notifications Panel ── */
  notifOpen: false,
  toggleNotifPanel() {
    this.notifOpen = !this.notifOpen;
    document.getElementById('notif-panel')?.classList.toggle('open', this.notifOpen);
    if (this.notifOpen) this.renderNotifications();
  },
  renderNotifications() {
    const panel = document.getElementById('notif-list');
    if (!panel || typeof DB === 'undefined') return;
    const settings = DB.getSettings();
    const minStock = settings.min_stock_default || 10;
    const stones = DB.getActiveStones();
    const lowStones = stones.filter(s => parseInt(s.qty_available) > 0 && parseInt(s.qty_available) <= minStock);
    const outStones = stones.filter(s => parseInt(s.qty_available) === 0);

    const items = [
      ...outStones.slice(0,3).map(s => ({ type:'danger', icon:'package-x', title: this.t('notif_out_stock'), msg: `${s.name_en} — ${this.t('status_out')}` })),
      ...lowStones.slice(0,5).map(s => ({ type:'warn', icon:'alert-triangle', title: this.t('notif_low_stock'), msg: `${s.name_en} — ${this.t('col_qty')}: ${s.qty_available}` })),
    ];

    const badge = document.getElementById('notif-badge');
    if (badge) { badge.textContent = items.length; badge.classList.toggle('hidden', items.length === 0); }

    if (!items.length) {
      panel.innerHTML = `<div style="text-align:center;padding:40px 20px"><div style="width:48px;height:48px;margin:0 auto 12px;color:var(--text-3)"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></div><div style="font-size:14px;font-weight:600;color:var(--text-2);margin-bottom:4px">${this.t('empty_notif')}</div><div style="font-size:12.5px;color:var(--text-3)">${this.t('empty_notif_desc')}</div></div>`;
      return;
    }
    panel.innerHTML = items.map(it => `
      <div class="notif-item">
        <div class="notif-icon ${it.type}">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${it.icon==='package-x'?'<path d="M7.5 4.27 2 7.68l10 5.46 10-5.46-5.5-3.41"/><path d="m2 7.68 10 5.46 10-5.46"/><path d="M12 22V13.14"/><path d="M22 9v5.5"/><path d="m15 19.5-3-3 3-3"/><path d="m19 13.5 3 3"/>'
          :'<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/>'}</svg>
        </div>
        <div>
          <div class="notif-title">${it.title}</div>
          <div class="notif-msg">${Utils.escapeHtml(it.msg)}</div>
        </div>
      </div>`).join('');
  },

  /* ── Global Search Modal ── */
  searchOpen: false,
  openSearch() {
    this.searchOpen = true;
    document.getElementById('search-modal')?.classList.add('open');
    setTimeout(() => document.getElementById('search-modal-input')?.focus(), 50);
  },
  closeSearch() {
    this.searchOpen = false;
    document.getElementById('search-modal')?.classList.remove('open');
    const inp = document.getElementById('search-modal-input');
    if (inp) { inp.value = ''; }
    const body = document.getElementById('search-modal-body');
    if (body) body.innerHTML = '';
  },
  runGlobalSearch(q) {
    const body = document.getElementById('search-modal-body');
    if (!body || typeof DB === 'undefined') return;
    if (!q.trim()) { body.innerHTML = ''; return; }
    const stones = DB.searchStones({ query: q }).slice(0, 8);
    const settings = DB.getSettings();
    const currency = settings.currency || 'SAR';
    const minStock = settings.min_stock_default || 10;
    if (!stones.length) {
      body.innerHTML = `<div style="text-align:center;padding:24px;color:var(--text-3);font-size:13px">${this.t('search_empty')}</div>`;
      return;
    }
    body.innerHTML = stones.map(s => `
      <div class="search-result-item" onclick="window.location.href='inventory.html'">
        <div class="search-result-icon">${s.image_data?`<img src="${s.image_data}" style="width:100%;height:100%;object-fit:cover;border-radius:var(--r-md)"/>`:`<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`}</div>
        <div style="flex:1;min-width:0">
          <div class="search-result-name">${Utils.escapeHtml(s.name_en)}</div>
          <div class="search-result-meta">${s.stone_code} · ${s.category||''} · ${this.t('col_qty')}: ${s.qty_available}</div>
        </div>
        <div style="text-align:right;flex-shrink:0">
          <div style="font-size:13px;font-weight:700;color:var(--gold)">${Utils.formatCurrency((parseFloat(s.selling_price)||0)*(parseInt(s.qty_available)||0), currency)}</div>
        </div>
      </div>`).join('');
  },

  /* ── Animated Counters ── */
  animateCounter(el, target, duration = 1200) {
    const start = 0;
    const startTime = performance.now();
    const isFloat = target % 1 !== 0;
    const step = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = start + (target - start) * eased;
      el.textContent = isFloat ? current.toFixed(2) : Math.round(current).toLocaleString('en');
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  },
  initCounters() {
    document.querySelectorAll('[data-counter]').forEach(el => {
      const target = parseFloat(el.dataset.counter) || 0;
      const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) { this.animateCounter(el, target); obs.disconnect(); }
        });
      });
      obs.observe(el);
    });
  },

  /* ── Confirm Modal ── */
  confirm(msg, onOk) {
    const el = document.getElementById('confirm-modal');
    if (!el) return;
    document.getElementById('confirm-msg').textContent = msg;
    document.getElementById('confirm-title-text').textContent = this.t('confirm_title');
    document.getElementById('confirm-ok-btn').textContent = this.t('btn_confirm');
    document.getElementById('confirm-cancel-btn').textContent = this.t('btn_cancel');
    document.getElementById('confirm-ok-btn').onclick = () => { Modal.close('confirm-modal'); onOk(); };
    Modal.open('confirm-modal');
  },

  /* ── Dropdown Manager ── */
  initDropdowns() {
    document.addEventListener('click', e => {
      document.querySelectorAll('.dropdown-menu.open').forEach(menu => {
        if (!menu.closest('.dropdown')?.contains(e.target)) menu.classList.remove('open');
      });
      // Notification panel close on outside click
      if (this.notifOpen) {
        const panel = document.getElementById('notif-panel');
        const btn = document.getElementById('notif-btn');
        if (panel && !panel.contains(e.target) && !btn?.contains(e.target)) {
          this.notifOpen = false;
          panel.classList.remove('open');
        }
      }
    });
    document.querySelectorAll('[data-dropdown-toggle]').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const menu = document.getElementById(btn.dataset.dropdownToggle);
        if (menu) {
          const wasOpen = menu.classList.contains('open');
          document.querySelectorAll('.dropdown-menu.open').forEach(m => m.classList.remove('open'));
          if (!wasOpen) menu.classList.add('open');
        }
      });
    });
  },

  /* ── Initialize ── */
  init() {
    // Auth guard
    if (!window.location.pathname.endsWith('index.html') && window.location.pathname !== '/'
        && !sessionStorage.getItem('bs_auth')) {
      window.location.href = 'index.html';
      return;
    }
    // Seed data
    if (typeof DB !== 'undefined') DB.seedDemoData();
    // Theme + Lang
    this.applyTheme(this.theme);
    this.applyLang(this.lang);
    // Sidebar
    this.applySidebar(this.sidebarCollapsed);
    // Lucide icons
    if (window.lucide) lucide.createIcons();
    // Active nav
    this.setActivePage();
    // Dropdowns
    this.initDropdowns();
    // Sidebar collapse button
    document.getElementById('collapse-btn')?.addEventListener('click', () => this.toggleSidebar());
    // Mobile menu
    document.getElementById('topbar-menu-btn')?.addEventListener('click', () => this.openMobileSidebar());
    document.getElementById('sidebar-overlay')?.addEventListener('click', () => this.closeMobileSidebar());
    // Theme toggle
    document.getElementById('theme-btn')?.addEventListener('click', () => this.toggleTheme());
    // Language toggle (topbar button)
    document.getElementById('lang-topbar-btn')?.addEventListener('click', () => {
      this.toggleLang();
    });
    // Sidebar lang buttons
    document.querySelectorAll('.lang-btn[data-lang]').forEach(btn => {
      btn.addEventListener('click', () => this.applyLang(btn.dataset.lang));
    });
    // Notification button
    document.getElementById('notif-btn')?.addEventListener('click', () => this.toggleNotifPanel());
    // Global search
    document.querySelector('.global-search-trigger')?.addEventListener('click', () => this.openSearch());
    document.getElementById('search-modal-overlay')?.addEventListener('click', e => {
      if (e.target.id === 'search-modal-overlay') this.closeSearch();
    });
    document.getElementById('search-modal-input')?.addEventListener('input', e => {
      this.runGlobalSearch(e.target.value);
    });
    // ⌘K shortcut
    document.addEventListener('keydown', e => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); this.openSearch(); }
      if (e.key === 'Escape') {
        this.closeSearch();
        this.closeMobileSidebar();
        document.querySelectorAll('.modal-overlay.open').forEach(m => {
          m.classList.remove('open');
          document.body.style.overflow = '';
        });
      }
    });
    // Animated counters
    this.initCounters();
    // Init notifications badge
    this.renderNotifications();
  }
};

/* ── Modal helper (extends existing) ── */
Object.assign(Modal, {
  open(id) { const el = document.getElementById(id); if (el) { el.classList.add('open'); document.body.style.overflow = 'hidden'; } },
  close(id) { const el = document.getElementById(id); if (el) { el.classList.remove('open'); document.body.style.overflow = ''; } },
  confirm(msg, onOk) { UI.confirm(msg, onOk); }
});

/* ── Toast helper ── */
Object.assign(Toast, {
  _icons: {
    success: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
    error:   '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
    warning: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
    info:    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>',
  },
  show(title, msg = '', type = 'info', ms = 4000) {
    let c = document.getElementById('toast-container');
    if (!c) { c = document.createElement('div'); c.id = 'toast-container'; document.body.appendChild(c); }
    const t = document.createElement('div');
    t.className = `toast ${type}`;
    t.innerHTML = `<div class="toast-icon">${this._icons[type]||this._icons.info}</div><div class="toast-content"><div class="toast-title">${Utils.escapeHtml(title)}</div>${msg?`<div class="toast-msg">${Utils.escapeHtml(msg)}</div>`:''}</div><button class="toast-close" onclick="this.parentElement.remove()"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>`;
    c.appendChild(t);
    setTimeout(() => { t.style.opacity='0'; t.style.transition='opacity 0.3s'; setTimeout(() => t.remove(), 350); }, ms);
  },
  success(msg, sub) { this.show(msg, sub||'', 'success'); },
  error(msg, sub)   { this.show(msg, sub||'', 'error'); },
  warning(msg, sub) { this.show(msg, sub||'', 'warning'); },
  info(msg, sub)    { this.show(msg, sub||'', 'info'); },
});

/* ── Helper functions used in HTML pages ── */
function getStockBadge(qty, min = 10) {
  const q = parseInt(qty)||0;
  const lang = UI.lang;
  if (q===0) return `<span class="status-pill out-stock"><span class="status-dot"></span>${T[lang].status_out||'Out of Stock'}</span>`;
  if (q<=min) return `<span class="status-pill low-stock"><span class="status-dot"></span>${T[lang].status_low||'Low Stock'}</span>`;
  return `<span class="status-pill in-stock"><span class="status-dot"></span>${T[lang].status_in||'In Stock'}</span>`;
}

function getTxBadge(type) {
  const lang = UI.lang;
  const map = { in:['badge tx-in',T[lang].tx_in], out:['badge tx-out',T[lang].tx_out], adjustment:['badge tx-adj',T[lang].tx_adj], return:['badge tx-return',T[lang].tx_return] };
  const [cls,lbl] = map[type]||['badge badge-silver',type];
  return `<span class="${cls}">${lbl}</span>`;
}

function getColorDot(color) {
  const map = { White:'#F8FAFC', Red:'#EF4444', Pink:'#EC4899', Blue:'#3B82F6', Green:'#10B981', Yellow:'#F59E0B', Orange:'#F97316', Purple:'#8B5CF6', Black:'#374151', Brown:'#92400E', Gray:'#6B7280', Colorless:'#E5E7EB', 'Multi-Color':'#8B5CF6' };
  const c = map[color] || '#6B7280';
  return `<span class="color-dot" style="background:${c}"></span>${color}`;
}

document.addEventListener('DOMContentLoaded', () => {
  UI.init();

  // Command Palette Keyboard Shortcut (Ctrl+K or Cmd+K)
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      const modal = document.getElementById('bs-command-palette-modal');
      if (modal) {
        modal.classList.toggle('hidden');
        if (!modal.classList.contains('hidden')) {
          const input = document.getElementById('cmd-palette-input');
          if (input) input.focus();
        }
      }
    }
    if (e.key === 'Escape') {
      const modal = document.getElementById('bs-command-palette-modal');
      if (modal && !modal.classList.contains('hidden')) modal.classList.add('hidden');
      const notif = document.getElementById('bs-notification-drawer');
      if (notif && !notif.classList.contains('hidden')) notif.classList.add('hidden');
    }
  });

  // Global Event Delegation for Dynamic UI Components
  document.addEventListener('click', (e) => {
    // Open Command Palette
    if (e.target.closest('#btn-open-command-palette')) {
      const modal = document.getElementById('bs-command-palette-modal');
      if (modal) {
        modal.classList.remove('hidden');
        const input = document.getElementById('cmd-palette-input');
        if (input) input.focus();
      }
    }

    // Toggle Notifications Drawer
    if (e.target.closest('#btn-open-notifications') || e.target.closest('#btn-close-notifications')) {
      const drawer = document.getElementById('bs-notification-drawer');
      if (drawer) drawer.classList.toggle('hidden');
    }

    // Command Palette Quick Jump
    const cmdItem = e.target.closest('[data-cmd-tab]');
    if (cmdItem) {
      const targetTab = cmdItem.getAttribute('data-cmd-tab');
      const modal = document.getElementById('bs-command-palette-modal');
      if (modal) modal.classList.add('hidden');
      if (typeof window.switchTab === 'function') {
        window.switchTab(targetTab);
      }
    }

    // Sidebar Navigation Click
    const navItem = e.target.closest('[data-tab]');
    if (navItem && !navItem.classList.contains('bs-tab-item')) {
      const targetTab = navItem.getAttribute('data-tab');
      if (typeof window.switchTab === 'function') {
        window.switchTab(targetTab);
      }
    }

    // Toggle Theme Mode
    if (e.target.closest('#btn-toggle-theme')) {
      document.documentElement.classList.toggle('dark');
      const isDark = document.documentElement.classList.contains('dark');
      localStorage.setItem('baher_theme', isDark ? 'dark' : 'light');
    }

    // Toggle Sidebar Collapse
    if (e.target.closest('#btn-toggle-sidebar')) {
      const sidebar = document.getElementById('bs-app-sidebar');
      if (sidebar) {
        sidebar.classList.toggle('w-72');
        sidebar.classList.toggle('w-20');
      }
    }
  });
});

