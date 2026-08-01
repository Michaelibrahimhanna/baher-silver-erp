import os
import sys
from reportlab.lib.pagesizes import letter, A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, Image, HRFlowable
import arabic_reshaper
from bidi.algorithm import get_display

def ar(text):
    if not text:
        return ""
    reshaped = arabic_reshaper.reshape(text)
    return get_display(reshaped)

def build_pdf():
    pdf_path = r"d:\Ston\docs\baher_silver_erp_user_manual.pdf"
    pdf_path = os.path.abspath(pdf_path)
    
    doc = SimpleDocTemplate(
        pdf_path,
        pagesize=A4,
        rightMargin=36,
        leftMargin=36,
        topMargin=36,
        bottomMargin=36
    )

    styles = getSampleStyleSheet()

    # Custom Styles
    title_style = ParagraphStyle(
        'CoverTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=24,
        leading=28,
        textColor=colors.HexColor('#0F172A'),
        alignment=1, # Center
        spaceAfter=10
    )

    subtitle_style = ParagraphStyle(
        'CoverSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=13,
        leading=16,
        textColor=colors.HexColor('#D97706'),
        alignment=1,
        spaceAfter=20
    )

    heading_style = ParagraphStyle(
        'SectionHeader',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=15,
        leading=18,
        textColor=colors.HexColor('#0F172A'),
        spaceBefore=15,
        spaceAfter=10
    )

    body_style = ParagraphStyle(
        'BodyArabic',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        textColor=colors.HexColor('#334155'),
        alignment=2, # Right aligned for RTL
        spaceAfter=8
    )

    bullet_style = ParagraphStyle(
        'BulletArabic',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=colors.HexColor('#475569'),
        alignment=2,
        spaceAfter=4
    )

    story = []

    # Title & Header
    story.append(Paragraph(ar("BAHER SILVER ERP v4.0"), title_style))
    story.append(Paragraph(ar("دليل الإستخدام التشغيلي والكتالوج الشامل لمميزات النظام المؤسسي"), subtitle_style))
    story.append(HRFlowable(width="100%", thickness=2, color=colors.HexColor('#D97706'), spaceBefore=5, spaceAfter=15))

    # Executive Summary Box
    summary_text = ar("هذا المستند يوفر الدليل التشغيلي الشامل لنظام إدارة المصنع والمخازن والإنتاج ERP المعتمد لمصنع باهر سيلفر للفضة عيار 925/999 شامل مرحلة الأمان الهيكلية ومحرك التصنيع المتقدم.")
    story.append(Paragraph(summary_text, body_style))
    story.append(Spacer(1, 10))

    # Section 1: Auth & Security
    story.append(Paragraph(ar("1. نظام الهوية والأمان ومنع الاختراق (Enterprise Auth System)"), heading_style))
    auth_points = [
        "تسجيل الدخول المؤسسي وإدارة الجلسات برمز JWT وتدوير التوكين Refresh Token لمدة 30 يوماً.",
        "محرك تعقيد كلمات المرور وتتبع التاريخ لمنع إعادة استخدام آخر 5 كلمات سر سابقة.",
        "الحظر التلقائي عند المحاولات الخاطئة (Lockout 15 minutes بعد 5 محاولات متتالية).",
        "الأدوار المؤسسية السبعة (SUPER_ADMIN, FACTORY_MANAGER, WAREHOUSE_MANAGER, ACCOUNTANT, SALES, CASHIER, PRODUCTION_EMPLOYEE).",
        "تقمص حسابات الموظفين (Super Admin Impersonation) لمعاينة الصلاحيات مع تسجيل حدث أمني حتمي.",
        "مراقب الجلسات الأجهزة النشطة (Session Monitor) وإمكانية الإنهاء القسري مع ذكر سبب الإنهاء.",
        "محاكي الصلاحيات الشامل (Permission Simulator) مع تفسير أسباب المنح والرفض بالعربية والإنجليزية.",
        "سلسلة السجلات التشفيرية المقاومة للتعديل (Cryptographic SHA-256 Hash-Chain Audit Trail).",
        "حساب الطوارئ المعزول (Break Glass Emergency Protocol) ورموز الاستعادة (2FA Recovery Codes)."
    ]
    for pt in auth_points:
        story.append(Paragraph(ar(f"• {pt}"), bullet_style))

    story.append(Spacer(1, 15))

    # Section 2: Manufacturing Engine
    story.append(Paragraph(ar("2. محرك وأقسام التصنيع الثمانية (Phase 24 Manufacturing Engine)"), heading_style))
    mfg_points = [
        "المحطات الثمانية المتخصصة: السباكة والصب، الكحت والغسيل، حشو الأحجار، الصقل والتلميع، طلاء الروديوم، الختم الحكومي والليزر، مراقبة الجودة، والتغليف.",
        "شجرة المواد الهيكلية للموديلات والمتغيرات (Template & Independent Variant BOMs) تشمل الفضة، الأحجار، المكونات، الكيماويات، والمستهلكات.",
        "تتبع أوقات التشغيل والأنشطة للفنيين (Worker-Level Assignment & Precision Time Tracking).",
        "خط السير التراكمي المقاوم للتعديل (Immutable Manufacturing Order Timeline).",
        "حجز واستنعام الخامات التلقائي من المخازن وارتجاع الخامات غير المستهلكة.",
        "سجل الهدر والكسر المصنف (Casting Scrap, Bench Filings, Polishing Dust, Stone Damage) وتكرير الفضة.",
        "استلام القطع التامة بالخزينة الرئيسية وجواز السفر الرقمي DPP وضمان 25 سنة.",
        "حاسبة التكلفة الثمانية (8-Factor Cost Rollup): عمالة، آلات، فضة، كيماويات، كهرباء، مصاريف إدارية، هدر، واسترجاع.",
        "لوحة التحليلات المتقدمة: قياس معدل الفاعلية الشاملة OEE 92.5% ونسبة الإنتاج الخالي من العيوب FPY 96.8%."
    ]
    for pt in mfg_points:
        story.append(Paragraph(ar(f"• {pt}"), bullet_style))

    story.append(Spacer(1, 15))

    # Table of Work Centers
    story.append(Paragraph(ar("جدول محطات وأقسام التصنيع الثمانية:"), heading_style))
    table_data = [
        [ar("معدل التكلفة"), ar("الطاقة الانتاجية"), ar("اسم قسم التصنيع"), ar("كود المحطة")],
        [ar("120 ج.م/ساعة"), ar("15 قطعة/ساعة"), ar("السباكة والصب الأولي"), ar("WC-CASTING")],
        [ar("70 ج.م/ساعة"), ar("25 قطعة/ساعة"), ar("الكحت والغسيل الكيميائي"), ar("WC-CLEANING")],
        [ar("150 ج.م/ساعة"), ar("8 قطعة/ساعة"), ar("تركيب وحشو الأحجار"), ar("WC-SETTING")],
        [ar("90 ج.م/ساعة"), ar("12 قطعة/ساعة"), ar("الصقل والتلميع والبرادة"), ar("WC-POLISHING")],
        [ar("180 ج.م/ساعة"), ar("20 قطعة/ساعة"), ar("الطلاء وحمام الروديوم"), ar("WC-RHODIUM")],
        [ar("60 ج.م/ساعة"), ar("30 قطعة/ساعة"), ar("الختم الحكومي والليزر"), ar("WC-HALLMARK")],
        [ar("100 ج.م/ساعة"), ar("40 قطعة/ساعة"), ar("فحص ومراقبة الجودة"), ar("WC-QC")],
        [ar("50 ج.م/ساعة"), ar("50 قطعة/ساعة"), ar("التغليف والبطاقة الرقمية"), ar("WC-PACKAGING")]
    ]

    t = Table(table_data, colWidths=[110, 110, 180, 100])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#0F172A')),
        ('TEXTCOLOR', (0,0), (-1,0), colors.HexColor('#F59E0B')),
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
        ('FONTNAME', (0,0), (-1,-1), 'Helvetica-Bold'),
        ('FONTSIZE', (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#CBD5E1')),
    ]))
    story.append(t)

    story.append(Spacer(1, 20))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor('#CBD5E1'), spaceBefore=10, spaceAfter=10))
    story.append(Paragraph(ar("تم إصدار وتوليد هذا المستند آلياً بواسطة نظام Baher Silver ERP Engine © 2026"), ParagraphStyle('Footer', parent=styles['Normal'], alignment=1, fontSize=8, textColor=colors.HexColor('#94A3B8'))))

    doc.build(story)
    print(f"PDF User Manual generated successfully at: {pdf_path}")

if __name__ == '__main__':
    build_pdf()
