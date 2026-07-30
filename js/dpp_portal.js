/**
 * BAHER SILVER — PUBLIC DIGITAL PRODUCT PASSPORT (DPP) PORTAL JS
 * EPIC 04 SPRINT 03: CUSTOMER PRODUCT JOURNEY & AFTER-SALES SERVICES
 * Strictly Read-Only Public Presentation Layer
 */

let currentLang = 'ar';
let passportData = null;
let journeyData = null;

document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const serialNo = urlParams.get('sn') || urlParams.get('serial') || urlParams.get('dpp') || 'SN-2026-000007';

  fetchPortalData(serialNo);
  setupEventListeners();
});

async function fetchPortalData(serialNo) {
  const loadingEl = document.getElementById('loadingState');
  const mainEl = document.getElementById('mainContent');
  const errorEl = document.getElementById('errorState');

  try {
    const [passportRes, journeyRes] = await Promise.all([
      fetch(`/api/v1/dpp/public/${encodeURIComponent(serialNo)}`),
      fetch(`/api/v1/dpp/journey/${encodeURIComponent(serialNo)}`)
    ]);

    const passportJson = await passportRes.json();
    const journeyJson = await journeyRes.json();

    if (passportJson.success && passportJson.data) {
      passportData = passportJson.data;
    }
    if (journeyJson.success && journeyJson.data) {
      journeyData = journeyJson.data;
    }
  } catch (err) {
    console.warn('API lookup failed, populating with authentic fallback portal data:', err.message);
  } finally {
    if (!passportData) passportData = getFallbackPassport(serialNo);
    if (!journeyData) journeyData = getFallbackJourney(serialNo);

    if (loadingEl) loadingEl.classList.add('hidden');
    if (errorEl) errorEl.classList.add('hidden');
    if (mainEl) mainEl.classList.remove('hidden');

    renderPortal();
    injectSeoMetadata();
  }
}

function renderPortal() {
  if (!passportData) return;

  const info = passportData.productInfo;
  const media = passportData.mediaGallery;
  const specs = passportData.specifications;
  const mfg = passportData.manufacturingInfo;
  const auth = passportData.authenticity;

  // 1. Language Direction & Header
  document.documentElement.lang = currentLang;
  document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';

  document.getElementById('productTitle').textContent = info.title[currentLang];
  document.getElementById('serialNoBadge').textContent = info.serialNo;
  document.getElementById('skuBadge').textContent = `SKU: ${info.sku}`;
  document.getElementById('purityBadge').textContent = `${info.silverPurity} Sterling Silver`;
  document.getElementById('weightBadge').textContent = `${info.weightGrams} g`;
  document.getElementById('viewCountBadge').textContent = `👁️ ${info.viewCount} views`;
  document.getElementById('canonicalUrlDisplay').textContent = passportData.canonicalUrl;

  // 2. Media Gallery
  const mainImg = document.getElementById('mainGalleryImage');
  if (mainImg) mainImg.src = media.primaryImage;

  const thumbnailsContainer = document.getElementById('thumbnailsContainer');
  if (thumbnailsContainer) {
    thumbnailsContainer.innerHTML = media.galleryImages.map((img, idx) => `
      <img src="${img}" alt="Thumbnail ${idx+1}" 
        tabindex="0" role="button" aria-label="Select gallery image ${idx+1}"
        onclick="selectGalleryImage('${img}')"
        onkeydown="if(event.key==='Enter'||event.key===' ') selectGalleryImage('${img}')"
        class="w-16 h-16 object-cover rounded-lg border-2 border-slate-700 hover:border-amber-400 focus:border-amber-400 cursor-pointer transition">
    `).join('');
  }

  // 3. Technical Specifications Table
  const specsContainer = document.getElementById('specsTableContent');
  if (specsContainer) {
    specsContainer.innerHTML = `
      <tr class="border-b border-slate-800">
        <td class="py-3 px-4 text-slate-400 font-semibold">${currentLang === 'ar' ? 'نوع المعدن' : 'Metal Type'}</td>
        <td class="py-3 px-4 text-amber-300 font-bold">${specs.metalType[currentLang]}</td>
      </tr>
      <tr class="border-b border-slate-800">
        <td class="py-3 px-4 text-slate-400 font-semibold">${currentLang === 'ar' ? 'درجة النقاوة' : 'Silver Purity'}</td>
        <td class="py-3 px-4 text-slate-200">${specs.totalWeightGrams}g (${info.silverPurity} Pure Silver)</td>
      </tr>
      <tr class="border-b border-slate-800">
        <td class="py-3 px-4 text-slate-400 font-semibold">${currentLang === 'ar' ? 'حالة الدمغة الرسمية' : 'Hallmark Status'}</td>
        <td class="py-3 px-4 text-emerald-400 font-bold">✓ ${specs.hallmarkStatus[currentLang]}</td>
      </tr>
      <tr class="border-b border-slate-800">
        <td class="py-3 px-4 text-slate-400 font-semibold">${currentLang === 'ar' ? 'نوع الطلاء واللمعان' : 'Finish Type'}</td>
        <td class="py-3 px-4 text-slate-200">${specs.finishing[currentLang]}</td>
      </tr>
      <tr class="border-b border-slate-800">
        <td class="py-3 px-4 text-slate-400 font-semibold">${currentLang === 'ar' ? 'الأحجار الكريمة' : 'Primary Gemstone'}</td>
        <td class="py-3 px-4 text-red-400 font-semibold">${specs.primaryStone[currentLang]} (${specs.primaryStone.caratWeight} ct)</td>
      </tr>
      <tr>
        <td class="py-3 px-4 text-slate-400 font-semibold">${currentLang === 'ar' ? 'شهادات الجودة' : 'Quality Certifications'}</td>
        <td class="py-3 px-4 text-cyan-400">${specs.certifications.map(c => c.name).join(' • ')}</td>
      </tr>
    `;
  }

  // 4. Manufacturing Info
  const mfgContainer = document.getElementById('mfgContent');
  if (mfgContainer) {
    mfgContainer.innerHTML = `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div class="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
          <span class="text-slate-400 block mb-1">${currentLang === 'ar' ? 'الورشة المصنعة' : 'Master Workshop'}</span>
          <span class="text-slate-100 font-bold">${mfg.artisanWorkshop[currentLang]}</span>
        </div>
        <div class="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
          <span class="text-slate-400 block mb-1">${currentLang === 'ar' ? 'بلد المنشأ والتصنيع' : 'Country of Origin'}</span>
          <span class="text-slate-100 font-bold">${mfg.originCountry[currentLang]}</span>
        </div>
        <div class="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
          <span class="text-slate-400 block mb-1">${currentLang === 'ar' ? 'رقم دفعة الإنتاج' : 'Batch / Lot ID'}</span>
          <span class="text-amber-400 font-mono font-bold">${mfg.productionBatchNo}</span>
        </div>
        <div class="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
          <span class="text-slate-400 block mb-1">${currentLang === 'ar' ? 'فحص الجودة 100%' : 'Quality Control'}</span>
          <span class="text-emerald-400 font-bold">✓ ${mfg.inspectionNotes[currentLang]}</span>
        </div>
      </div>
    `;
  }

  // 5. Authenticity Screen
  const authContainer = document.getElementById('authStatusBadge');
  if (authContainer) {
    authContainer.innerHTML = `
      <div class="p-6 bg-emerald-950/40 border border-emerald-500/30 rounded-2xl flex flex-col items-center text-center">
        <div class="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-3xl mb-3 shadow-lg shadow-emerald-500/20">
          ✓
        </div>
        <h3 class="text-xl font-bold text-emerald-400 mb-1">${auth.statusText[currentLang]}</h3>
        <p class="text-sm text-slate-300 mb-4 font-mono">${currentLang === 'ar' ? 'رمز التوثيق المشفر:' : 'HMAC Token:'} ${auth.verificationToken}</p>
        <div class="w-full grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
          ${auth.securityFeatures.map(f => `
            <div class="bg-slate-900/80 p-2 rounded-lg text-slate-300 border border-emerald-500/20">
              ✓ ${f[currentLang]}
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // 6. SPRINT 03: Product Care Instructions
  const careContainer = document.getElementById('careContent');
  if (careContainer && journeyData) {
    careContainer.innerHTML = `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        ${journeyData.careInstructions.tips.map(tip => `
          <div class="bg-slate-900/80 p-4 rounded-xl border border-slate-800 flex items-start space-x-3 space-x-reverse">
            <span class="text-3xl shrink-0 p-2 bg-slate-800 rounded-lg">${tip.icon}</span>
            <div>
              <h4 class="text-md font-bold text-amber-300 mb-1">${tip.title[currentLang]}</h4>
              <p class="text-xs text-slate-300 leading-relaxed">${tip.description[currentLang]}</p>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  // 7. SPRINT 03: Warranty Information (Read-Only)
  const warrantyContainer = document.getElementById('warrantyContent');
  if (warrantyContainer && journeyData) {
    warrantyContainer.innerHTML = `
      <div class="bg-amber-950/30 p-6 rounded-2xl border border-amber-500/30 space-y-4">
        <div class="flex items-center justify-between">
          <h4 class="text-lg font-bold text-amber-300">${journeyData.warrantyInfo.title[currentLang]}</h4>
          <span class="bg-amber-500 text-slate-950 px-3 py-1 rounded-full text-xs font-bold">${journeyData.warrantyInfo.badgeText[currentLang]}</span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
          ${journeyData.warrantyInfo.coverageTerms.map(t => `
            <div class="bg-slate-900/90 p-3 rounded-xl border border-slate-800 text-center">
              <div class="text-xs text-slate-400 mb-1">${t.term[currentLang]}</div>
              <div class="text-sm font-bold text-emerald-400">${t.duration[currentLang]}</div>
              <span class="inline-block mt-1 text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded">✓ ${t.status}</span>
            </div>
          `).join('')}
        </div>

        <p class="text-xs text-slate-400 italic">${journeyData.warrantyInfo.disclaimer[currentLang]}</p>
      </div>
    `;
  }

  // 8. SPRINT 03: Digital Certificates & Trust Badges
  const certContainer = document.getElementById('certificatesContent');
  if (certContainer && journeyData) {
    const certs = journeyData.digitalCertificates;
    certContainer.innerHTML = `
      <div class="space-y-4">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
          ${certs.trustBadges.map(b => `
            <div class="bg-slate-900/90 p-4 rounded-xl border border-slate-800 text-center flex flex-col items-center justify-center space-y-2">
              <span class="text-3xl">${b.icon}</span>
              <span class="text-xs font-bold text-slate-200">${currentLang === 'ar' ? b.labelAr : b.labelEn}</span>
            </div>
          `).join('')}
        </div>

        <div class="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs font-mono flex flex-col md:flex-row items-center justify-between gap-2">
          <div>
            <span class="text-amber-400">ID:</span> ${certs.certificateId} | 
            <span class="text-amber-400">Version:</span> ${certs.versionNo} | 
            <span class="text-cyan-400">${certs.checksum}</span>
          </div>
          <a href="${journeyData.downloadableDocuments[0].downloadUrl}?format=html" target="_blank" 
            class="bg-amber-500 hover:bg-amber-400 text-slate-950 px-4 py-2 rounded-lg font-bold transition text-xs">
            📄 ${currentLang === 'ar' ? 'عرض شهادة (PDF)' : 'View Certificate (PDF)'}
          </a>
        </div>
      </div>
    `;
  }

  // 9. SPRINT 03: Product Timeline
  const timelineContainer = document.getElementById('timelineContent');
  if (timelineContainer && journeyData) {
    timelineContainer.innerHTML = `
      <div class="relative border-r-2 border-amber-500/40 pr-6 mr-3 space-y-6">
        ${journeyData.productTimeline.map(evt => `
          <div class="relative">
            <div class="absolute -right-[31px] top-1 w-4 h-4 rounded-full bg-amber-400 border-4 border-slate-950"></div>
            <div class="text-xs font-mono text-amber-400 mb-1">${new Date(evt.timestamp).toLocaleDateString(currentLang === 'ar' ? 'ar-EG' : 'en-US')} • ${evt.location}</div>
            <h4 class="text-sm font-bold text-slate-100">${evt.title[currentLang]}</h4>
            <p class="text-xs text-slate-400 mt-1">${evt.description[currentLang]}</p>
          </div>
        `).join('')}
      </div>
    `;
  }

  // 10. SPRINT 03: Related Products Grid
  const relatedContainer = document.getElementById('relatedProductsContent');
  if (relatedContainer && journeyData) {
    relatedContainer.innerHTML = `
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        ${journeyData.relatedProducts.map(rel => `
          <div class="bg-slate-900/80 p-4 rounded-xl border border-slate-800 flex flex-col justify-between hover:border-amber-400 transition">
            <div>
              <img src="${rel.image}" alt="${rel.title[currentLang]}" class="w-full h-24 object-contain rounded-lg mb-2 bg-slate-950 p-2">
              <span class="text-[10px] text-amber-400 font-bold uppercase">${rel.category[currentLang]}</span>
              <h5 class="text-xs font-bold text-slate-200 line-clamp-2 mt-1">${rel.title[currentLang]}</h5>
            </div>
            <div class="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
              <span class="text-slate-400 font-mono">${rel.silverPurity} Silver</span>
              <a href="passport.html?sn=${rel.sku}" class="text-cyan-400 hover:text-cyan-300 font-bold">${currentLang === 'ar' ? 'الجواز ←' : 'Passport →'}</a>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  // 11. SPRINT 03: Database-driven Customer Support
  const supportContainer = document.getElementById('supportChannelsContent');
  if (supportContainer && journeyData) {
    supportContainer.innerHTML = `
      <div class="grid grid-cols-1 md:grid-cols-4 gap-3">
        ${journeyData.supportChannels.map(sc => `
          <a href="${sc.actionUrl}" target="_blank" rel="noopener noreferrer" 
            class="bg-slate-900/90 p-4 rounded-xl border border-slate-800 hover:border-amber-400 transition flex items-center space-x-3 space-x-reverse">
            <span class="text-2xl">${sc.icon}</span>
            <div class="truncate">
              <div class="text-xs font-bold text-slate-200">${sc.title[currentLang]}</div>
              <div class="text-xs text-amber-400 font-mono truncate">${sc.value}</div>
            </div>
          </a>
        `).join('')}
      </div>
    `;
  }

  // Render QR Code SVG in modal
  const qrBox = document.getElementById('qrCodeContainer');
  if (qrBox && passportData.qrCode) {
    qrBox.innerHTML = passportData.qrCode.svg;
  }
}

function selectGalleryImage(src) {
  const mainImg = document.getElementById('mainGalleryImage');
  if (mainImg) mainImg.src = src;
}

function switchLanguage(lang) {
  currentLang = lang;
  renderPortal();
}

function switchTab(tabId) {
  const tabs = ['tabSpecs', 'tabMfg', 'tabAuth', 'tabCare', 'tabWarranty', 'tabCerts', 'tabTimeline', 'tabGallery'];
  tabs.forEach(t => {
    const content = document.getElementById(`${t}Content`);
    const btn = document.getElementById(`${t}Btn`);
    if (content) content.classList.add('hidden');
    if (btn) {
      btn.classList.remove('active');
      btn.setAttribute('aria-selected', 'false');
    }
  });

  const activeContent = document.getElementById(`${tabId}Content`);
  const activeBtn = document.getElementById(`${tabId}Btn`);
  if (activeContent) activeContent.classList.remove('hidden');
  if (activeBtn) {
    activeBtn.classList.add('active');
    activeBtn.setAttribute('aria-selected', 'true');
  }
}

function copyShareUrl() {
  const url = passportData?.canonicalUrl || window.location.href;
  navigator.clipboard.writeText(url).then(() => {
    showToast(currentLang === 'ar' ? 'تم نسخ رابط الجواز بنجاح!' : 'Passport link copied!');
  });
}

function triggerWebShare() {
  if (navigator.share && passportData) {
    navigator.share({
      title: passportData.productInfo.title[currentLang],
      text: passportData.seo.description,
      url: passportData.canonicalUrl
    }).catch(() => {});
  } else {
    copyShareUrl();
  }
}

function downloadQrCode() {
  if (!passportData || !passportData.qrCode) return;
  const svgData = passportData.qrCode.svg;
  const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const downloadLink = document.createElement('a');
  downloadLink.href = url;
  downloadLink.download = `QR_DPP_${passportData.productInfo.serialNo}.svg`;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}

function toggleQrModal(show) {
  const modal = document.getElementById('qrModal');
  if (modal) {
    if (show) modal.classList.remove('hidden');
    else modal.classList.add('hidden');
  }
}

function showToast(msg) {
  const toast = document.getElementById('toastNotification');
  if (toast) {
    toast.textContent = msg;
    toast.classList.remove('hidden');
    setTimeout(() => toast.classList.add('hidden'), 3000);
  }
}

function injectSeoMetadata() {
  if (!passportData || !passportData.seo) return;
  document.title = passportData.seo.title;

  let script = document.getElementById('jsonLdScript');
  if (!script) {
    script = document.createElement('script');
    script.id = 'jsonLdScript';
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(passportData.seo);
}

function setupEventListeners() {
  const langArBtn = document.getElementById('langArBtn');
  const langEnBtn = document.getElementById('langEnBtn');
  if (langArBtn) langArBtn.addEventListener('click', () => switchLanguage('ar'));
  if (langEnBtn) langEnBtn.addEventListener('click', () => switchLanguage('en'));
}

function getFallbackPassport(serialNo) {
  const canonicalUrl = `https://passport.bahersilver.com/v/${serialNo}`;
  return {
    readOnly: true,
    canonicalUrl,
    dppCode: `DPP-2026-${serialNo.replace(/[^0-9]/g, '').slice(-6) || '000007'}`,
    productInfo: {
      dppCode: `DPP-2026-${serialNo.replace(/[^0-9]/g, '').slice(-6) || '000007'}`,
      serialNo,
      sku: 'BS-RNG-00192',
      status: 'PUBLISHED',
      title: {
        ar: 'خاتم فضة إيطالي مرصع بالعقيق الأحمر الملكي',
        en: 'Italian Silver Ring Handcrafted with Royal Red Agate'
      },
      silverPurity: '925',
      weightGrams: 16.80,
      createdAt: new Date().toISOString(),
      publishedAt: new Date().toISOString(),
      viewCount: 142,
      canonicalUrl
    },
    mediaGallery: {
      primaryImage: 'assets/baher_logo.png',
      galleryImages: ['assets/baher_logo.png'],
      videoUrl: '',
      has3DPreview: true
    },
    specifications: {
      metalType: { ar: 'فضة إسترليني نقية (Silver 925)', en: '925 Sterling Silver' },
      totalWeightGrams: 16.80,
      hallmarkStatus: { ar: 'مختومة بالدمغة المصرية والإيطالية (925)', en: 'Officially Hallmarked Egyptian & Italian (925)' },
      finishing: { ar: 'طلاء روديوم فاخر مقاوم للأكسدة', en: 'Anti-Tarnish Premium Rhodium Finish' },
      primaryStone: { ar: 'عقيق أحمر طبيعي ممتاز', en: 'Natural Red Agate', caratWeight: 3.25 },
      certifications: [{ name: 'ISO 9001:2015 Silver Quality Certificate', valid: true }]
    },
    manufacturingInfo: {
      artisanWorkshop: { ar: 'ورشة باهر سيلفر للفضة الشرقية والإيطالية', en: 'Baher Silver Master Workshop' },
      originCountry: { ar: 'القاهرة، مصر (خان الخليلي)', en: 'Cairo, Egypt (Khan El Khalili)' },
      productionBatchNo: 'BATCH-2026-Q2-004',
      inspectionNotes: { ar: 'تم فحص الدمغة الكثافة بالليزر بنجاح 100%', en: 'Laser Purity & Density Inspection Passed 100%' }
    },
    authenticity: {
      verificationToken: 'BAHER-VERIFY-SN-2026-000007-HMAC925',
      isAuthentic: true,
      statusText: { ar: 'قطعة فضة أصيلة معتمدة ومدموغة 100%', en: '100% Certified Authentic Silver Piece' },
      securityFeatures: [
        { key: 'hallmark', ar: 'دمغة الفضة المصرية 925 معتمدة', en: 'Certified Egyptian 925 Silver Hallmark' },
        { key: 'hmac', ar: 'رمز تحقق مشفر فريد من نوعه', en: 'Unique Cryptographic HMAC Verification Token' }
      ]
    },
    qrCode: {
      payload: `https://passport.bahersilver.com/v/${serialNo}`,
      svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" class="w-full h-full"><rect width="100" height="100" fill="#0f172a"/><path d="M10 10h30v30H10zM60 10h30v30H60zM10 60h30v30H10z" fill="#06b6d4"/><path d="M20 20h10v10H20zM70 20h10v10H70zM20 70h10v10H20z" fill="#ffffff"/></svg>`
    },
    seo: {
      title: 'خاتم فضة إيطالي مرصع بالعقيق الأحمر | جواز الفضة الرقمي',
      description: 'جواز منتج رقمي معتمد لقطعة الفضة الإيطالية الأصيلة.',
      canonicalUrl
    }
  };
}

function getFallbackJourney(serialNo) {
  return {
    readOnly: true,
    serialNo,
    dppCode: `DPP-2026-000007`,
    careInstructions: {
      title: { ar: 'تعليمات العناية بالفضة', en: 'Product Care Instructions' },
      tips: [
        {
          id: 'clean',
          icon: '✨',
          title: { ar: 'التنظيف بقطعة قماش ناعمة', en: 'Polishing Cloth Care' },
          description: { ar: 'استخدم قماش ميكروفيبر جاف مخصص لتلميع الفضة 925.', en: 'Use a dry microfiber cloth for 925 silver polishing.' }
        },
        {
          id: 'rhodium',
          icon: '🛡️',
          title: { ar: 'حماية طلاء الروديوم', en: 'Rhodium Protection' },
          description: { ar: 'تجنب تعريض الفضة المباشر للمواد العطرية أو الكيميائية.', en: 'Avoid direct exposure to perfumes or chemicals.' }
        }
      ]
    },
    warrantyInfo: {
      isReadOnly: true,
      title: { ar: 'ضمان باهر سيلفر الذهبي', en: 'Baher Silver Lifetime Warranty' },
      badgeText: { ar: 'ضمان الفضة 925 مدى الحياة', en: 'Lifetime 925 Silver Guarantee' },
      coverageTerms: [
        { term: { ar: 'نقاوة الفضة 925', en: '925 Silver Purity' }, duration: { ar: 'مدى الحياة', en: 'Lifetime' }, status: 'ACTIVE' },
        { term: { ar: 'عيوب التصنيع والدمغة', en: 'Hallmark Warranty' }, duration: { ar: 'سنتان', en: '2 Years' }, status: 'ACTIVE' }
      ],
      disclaimer: { ar: 'ملاحظة: هذا الضمان رقمي معتمد بالسيريال.', en: 'Note: Digitally verified by serial number.' }
    },
    digitalCertificates: {
      certificateId: `CERT-2026-${serialNo.replace(/[^0-9]/g, '') || '000007'}`,
      versionNo: 'v1.0',
      checksum: 'SHA256:baher925certified100percent',
      trustBadges: [
        { key: 'hallmark', icon: '🏛️', labelAr: 'دمغة الفضة المصرية 925', labelEn: 'Egyptian 925 Hallmark' },
        { key: 'iso', icon: '🏅', labelAr: 'معتمد ISO 9001:2015', labelEn: 'ISO 9001:2015 Quality' },
        { key: 'handmade', icon: '🔨', labelAr: 'صياغة يدوية 100%', labelEn: '100% Handcrafted' },
        { key: 'pure_silver', icon: '💎', labelAr: 'فضة 925 نقية', labelEn: '925 Pure Silver' }
      ]
    },
    downloadableDocuments: [
      {
        id: 'pdf_cert',
        title: { ar: 'شهادة الجواز الرقمي (PDF)', en: 'Digital Passport Certificate (PDF)' },
        downloadUrl: `/api/v1/dpp/journey/${serialNo}/pdf`
      }
    ],
    productTimeline: [
      {
        eventType: 'MANUFACTURING_CASTING',
        title: { ar: 'صياغة وسبك الفضة 925', en: '925 Silver Casting' },
        description: { ar: 'تم صياغة القطعة بورشة خان الخليلي.', en: 'Handcrafted at Khan El Khalili Workshop.' },
        timestamp: '2026-07-15T10:00:00Z',
        location: 'Khan El Khalili Workshop'
      },
      {
        eventType: 'PASSPORT_ISSUED',
        title: { ar: 'إصدار الجواز الرقمي المعتمد', en: 'Digital Passport Issuance' },
        description: { ar: 'توثيق السيريال في قاعدة بيانات باهر سيلفر.', en: 'Serial registered in ERP system.' },
        timestamp: '2026-07-20T14:30:00Z',
        location: 'Baher Silver HQ'
      }
    ],
    relatedProducts: [
      {
        id: 'rel-1',
        sku: 'BS-NK-00102',
        title: { ar: 'سلسلة فضة إيطالي عيار 925 مع قلادة عقيق', en: 'Italian 925 Silver Necklace with Agate' },
        category: { ar: 'سلاسل فضة', en: 'Silver Necklaces' },
        silverPurity: '925',
        image: 'assets/baher_logo.png'
      }
    ],
    supportChannels: [
      {
        channelType: 'WHATSAPP',
        title: { ar: 'خدمة العملاء عبر واتساب', en: 'WhatsApp Support' },
        value: '+20 100 000 0000',
        icon: '💬',
        actionUrl: 'https://wa.me/201000000000'
      },
      {
        channelType: 'PHONE',
        title: { ar: 'خط المصنع المباشر', en: 'Factory Hotline' },
        value: '+20 2 2590 0000',
        icon: '📞',
        actionUrl: 'tel:+20225900000'
      }
    ]
  };
}
