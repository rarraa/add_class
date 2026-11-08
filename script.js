// ========================================================
// LINK PAGE UMKM: RASA NUSANTARA
// Penerapan Materi Web Development P1 - P4
// Arsitektur: Tiny React (State -> Render), Semantic & Clean
// ========================================================

// ===== STYLE TAILWIND =====
const CARD_CLASSES =
  "group relative flex items-center gap-3.5 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-stone-200/90 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:ring-amber-500/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600 dark:bg-stone-900 dark:ring-stone-800 dark:hover:ring-amber-400/80 motion-reduce:transition-none motion-reduce:hover:translate-y-0 text-left";

const TAB_CLASSES =
  "rounded-full bg-white px-3.5 py-1.5 text-xs md:text-sm font-medium text-stone-700 ring-1 ring-stone-200 transition-all duration-150 aria-pressed:bg-amber-600 aria-pressed:text-white aria-pressed:ring-amber-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600 dark:bg-stone-900 dark:text-stone-200 dark:ring-stone-800 dark:aria-pressed:bg-amber-500 dark:aria-pressed:text-stone-950 dark:aria-pressed:font-semibold";

const PROD_TAB_CLASSES =
  "rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-600 transition-all duration-150 aria-pressed:bg-amber-600 aria-pressed:text-white dark:bg-stone-800 dark:text-stone-300 dark:aria-pressed:bg-amber-500 dark:aria-pressed:text-stone-950 dark:aria-pressed:font-semibold";

const MESSAGE_CLASSES =
  "rounded-2xl bg-white px-5 py-6 text-center text-sm text-stone-500 ring-1 ring-stone-200 dark:bg-stone-900 dark:text-stone-400 dark:ring-stone-800";

// Daftar Kategori Tab Filter Tautan
const TABS = [
  { category: "semua", label: "Semua Tautan" },
  { category: "menu", label: "☕ Menu & Pesan" },
  { category: "marketplace", label: "🛍️ Toko Online" },
  { category: "sosmed", label: "📱 Sosial Media" },
  { category: "kontak", label: "📍 Kontak & Lokasi" }
];

// Daftar Kategori Tab Filter Galeri / Katalog
const PRODUCT_TABS = [
  { category: "semua", label: "Semua" },
  { category: "minuman", label: "☕ Minuman" },
  { category: "makanan", label: "🥐 Camilan" },
  { category: "kopi", label: "🌿 Biji Kopi" },
  { category: "paket", label: "🎁 Paket" }
];

// ===== STATE (Single Source of Truth - Pertemuan 4) =====
const state = {
  links: [],
  activeCategory: "semua",
  searchQuery: "",
  products: [],
  activeProductCategory: "semua",
  theme: document.documentElement.classList.contains("dark") ? "dark" : "light",
  status: "loading" // "loading" | "ready" | "error"
};

// Satu-satunya pintu perubahan data (Tiny React)
function setState(changes) {
  Object.assign(state, changes);
  render();
}

// ===== HELPER: PENCEGAHAN SERANGAN XSS =====
function escapeHtml(text) {
  if (text === null || text === undefined) return "";
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// ===== FILTER & SEARCH LOGIC =====
function getVisibleLinks(state) {
  let list = state.links;

  // Filter Kategori
  if (state.activeCategory !== "semua") {
    list = list.filter(function (link) {
      return link.category === state.activeCategory;
    });
  }

  // Filter Pencarian Cepat (Live Search)
  const q = state.searchQuery.trim().toLowerCase();
  if (q !== "") {
    list = list.filter(function (link) {
      const matchTitle = (link.title || "").toLowerCase().includes(q);
      const matchSub = (link.subtitle || "").toLowerCase().includes(q);
      const matchCat = (link.category || "").toLowerCase().includes(q);
      return matchTitle || matchSub || matchCat;
    });
  }

  return list;
}

function getVisibleProducts(state) {
  if (state.activeProductCategory === "semua") {
    return state.products;
  }
  return state.products.filter(function (product) {
    return product.category === state.activeProductCategory;
  });
}

// ===== KOMPONEN UI (Pertemuan 4) =====

// 1. Komponen Kartu Tautan UMKM
function LinkCard(link) {
  let extraAttributes = "";
  if (link.url.startsWith("http")) {
    extraAttributes = ' target="_blank" rel="noopener noreferrer"';
  }

  const badgeHtml = link.badge
    ? `<span class="inline-block rounded-md bg-amber-100/90 px-2 py-0.5 text-[10px] font-semibold text-amber-800 dark:bg-amber-950 dark:text-amber-300">
         ${escapeHtml(link.badge)}
       </span>`
    : "";

  const subtitleHtml = link.subtitle
    ? `<p class="mt-0.5 text-xs text-stone-500 dark:text-stone-400 line-clamp-1">
         ${escapeHtml(link.subtitle)}
       </p>`
    : "";

  return `
    <li>
      <a href="${escapeHtml(link.url)}"${extraAttributes} class="${CARD_CLASSES}">
        <!-- Ikon Tautan -->
        <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-xl ring-1 ring-amber-200/60 dark:bg-amber-950/40 dark:ring-amber-900/60" aria-hidden="true">
          ${escapeHtml(link.icon || "🔗")}
        </div>
        
        <!-- Info & Deskripsi -->
        <div class="min-w-0 flex-1">
          <div class="flex flex-wrap items-center gap-1.5">
            <span class="font-semibold text-stone-900 group-hover:text-amber-700 dark:text-stone-100 dark:group-hover:text-amber-400 text-sm md:text-base">
              ${escapeHtml(link.title)}
            </span>
            ${badgeHtml}
          </div>
          ${subtitleHtml}
        </div>

        <!-- Indikator Panah -->
        <span class="text-stone-400 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-amber-600 dark:text-stone-500 dark:group-hover:text-amber-400" aria-hidden="true">
          →
        </span>
      </a>
    </li>`;
}

// 2. Komponen Daftar Link
function LinkList(state) {
  if (state.status === "loading") {
    return LoadingState();
  }
  if (state.status === "error") {
    return ErrorState();
  }

  const visibleLinks = getVisibleLinks(state);
  if (visibleLinks.length === 0) {
    return EmptyState();
  }

  return visibleLinks
    .map(function (link) {
      return LinkCard(link);
    })
    .join("");
}

// 3. Komponen Tab Filter Tautan
function FilterTabs(state) {
  return TABS.map(function (tab) {
    const isActive = tab.category === state.activeCategory;
    return `
      <button type="button" data-action="filter" data-category="${tab.category}"
              aria-pressed="${isActive}" class="${TAB_CLASSES}">
        ${tab.label}
      </button>`;
  }).join("");
}

// 4. Komponen Tab Filter Katalog
function ProductFilterTabs(state) {
  return PRODUCT_TABS.map(function (tab) {
    const isActive = tab.category === state.activeProductCategory;
    return `
      <button type="button" data-action="filter-product" data-category="${tab.category}"
              aria-pressed="${isActive}" class="${PROD_TAB_CLASSES}">
        ${tab.label}
      </button>`;
  }).join("");
}

// 5. Komponen Kartu Galeri / Katalog Produk
function ProductCard(product) {
  const waUrl = `https://wa.me/6281234567890?text=Halo%20Rasa%20Nusantara,%20saya%20ingin%20pesan%20menu%20*${encodeURIComponent(product.name)}*%20(${encodeURIComponent(product.price)}).`;

  const badgeHtml = product.badge
    ? `<span class="absolute top-2 left-2 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-bold text-amber-900 shadow-sm backdrop-blur-sm dark:bg-stone-900/90 dark:text-amber-300">
         ${escapeHtml(product.badge)}
       </span>`
    : "";

  return `
    <article class="product-card group relative flex flex-col justify-between overflow-hidden rounded-xl bg-stone-50 p-3 ring-1 ring-stone-200/80 transition-all dark:bg-stone-950 dark:ring-stone-800">
      <div>
        <!-- Visual Thumbnail Galeri -->
        <div class="relative flex h-24 w-full items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br ${escapeHtml(product.gradient || 'from-amber-700 to-amber-900')} shadow-inner">
          <span class="product-image-box text-4xl select-none" aria-hidden="true">${escapeHtml(product.icon || '☕')}</span>
          ${badgeHtml}
        </div>

        <!-- Detail Produk -->
        <h3 class="mt-2.5 text-xs font-bold text-stone-900 group-hover:text-amber-700 dark:text-stone-100 dark:group-hover:text-amber-400 line-clamp-1">
          ${escapeHtml(product.name)}
        </h3>
        <p class="mt-1 text-[11px] text-stone-500 dark:text-stone-400 line-clamp-2 leading-relaxed">
          ${escapeHtml(product.description)}
        </p>
      </div>

      <!-- Harga & Tombol Pesan Langsung -->
      <div class="mt-3 flex items-center justify-between border-t border-stone-200/60 pt-2 dark:border-stone-800/80">
        <span class="text-xs font-extrabold text-amber-700 dark:text-amber-400">
          ${escapeHtml(product.price)}
        </span>
        <a href="${waUrl}" target="_blank" rel="noopener noreferrer"
           class="inline-flex items-center gap-1 rounded-lg bg-amber-600 px-2.5 py-1 text-[11px] font-semibold text-white shadow-xs transition hover:bg-amber-700 active:scale-95 dark:bg-amber-500 dark:hover:bg-amber-600 dark:text-stone-950"
           title="Pesan ${escapeHtml(product.name)} via WhatsApp">
          <span>Pesan</span> <span>💬</span>
        </a>
      </div>
    </article>`;
}

// 6. Komponen Grid Galeri Produk
function ProductGrid(state) {
  const visibleProducts = getVisibleProducts(state);
  if (visibleProducts.length === 0) {
    return `
      <div class="col-span-2 py-6 text-center text-xs text-stone-400">
        Belum ada produk di kategori ini.
      </div>`;
  }
  return visibleProducts
    .map(function (prod) {
      return ProductCard(prod);
    })
    .join("");
}

// 7. Komponen Status State
function EmptyState() {
  const query = state.searchQuery ? ` untuk pencarian "${escapeHtml(state.searchQuery)}"` : "";
  return `
    <li class="${MESSAGE_CLASSES}">
      <span class="text-2xl" aria-hidden="true">🍃</span>
      <p class="mt-2 font-medium text-stone-700 dark:text-stone-300">Belum ada tautan yang cocok${query}</p>
      <p class="mt-1 text-xs text-stone-400">Silakan pilih kategori lain atau gunakan kata kunci pencarian berbeda.</p>
    </li>`;
}

function LoadingState() {
  return `
    <li class="${MESSAGE_CLASSES} animate-pulse">
      <div class="inline-block h-6 w-6 animate-spin rounded-full border-2 border-amber-600 border-t-transparent dark:border-amber-400"></div>
      <p class="mt-2 text-stone-600 dark:text-stone-400">Memuat katalog menu & tautan UMKM…</p>
    </li>`;
}

function ErrorState() {
  return `
    <li class="${MESSAGE_CLASSES} border-rose-200 dark:border-rose-900">
      <span class="text-2xl" aria-hidden="true">⚠️</span>
      <p class="mt-1 font-semibold text-rose-600 dark:text-rose-400">Gagal memuat data tautan.</p>
      <p class="mt-1 text-xs text-stone-500">Pastikan membuka halaman via Live Server atau website yang sudah ter-deploy.</p>
    </li>`;
}

// 8. Komponen Penghitung Link
function LinkCount(state) {
  if (state.status !== "ready") {
    return "";
  }
  const total = getVisibleLinks(state).length;
  return `Menampilkan ${total} tautan`;
}

// ===== RENDER SYSTEM =====
const filterTabs = document.querySelector("#filter-tabs");
const linkList = document.querySelector("#link-list");
const linkCount = document.querySelector("#link-count");
const themeToggle = document.querySelector("#theme-toggle");
const searchInput = document.querySelector("#search-input");
const productFilterTabs = document.querySelector("#product-filter-tabs");
const productGrid = document.querySelector("#product-grid");
const toast = document.querySelector("#toast");

function renderTheme() {
  const isDark = state.theme === "dark";
  document.documentElement.classList.toggle("dark", isDark);
  themeToggle.textContent = isDark ? "☀️" : "🌙";
  themeToggle.setAttribute(
    "aria-label",
    isDark ? "Ganti ke mode terang" : "Ganti ke mode gelap"
  );
  themeToggle.title = isDark ? "Beralih ke mode terang" : "Beralih ke mode gelap";
}

function render() {
  filterTabs.innerHTML = FilterTabs(state);
  linkList.innerHTML = LinkList(state);
  linkCount.textContent = LinkCount(state);
  if (productFilterTabs) {
    productFilterTabs.innerHTML = ProductFilterTabs(state);
  }
  if (productGrid) {
    productGrid.innerHTML = ProductGrid(state);
  }
  renderTheme();
}

// ===== TOAST NOTIFICATION =====
let toastTimer;
function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.remove("opacity-0", "translate-y-3", "pointer-events-none");
  toast.classList.add("opacity-100", "translate-y-0");

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove("opacity-100", "translate-y-0");
    toast.classList.add("opacity-0", "translate-y-3", "pointer-events-none");
  }, 2600);
}

// ===== INOVASI: STATUS BUKA/TUTUP TOKO REAL-TIME =====
function updateStoreStatus() {
  const dot = document.querySelector("#store-status-dot");
  const text = document.querySelector("#store-status-text");
  if (!dot || !text) return;

  const now = new Date();
  const hour = now.getHours();
  // Jam operasional UMKM: 08:00 - 21:00
  const isOpen = hour >= 8 && hour < 21;

  if (isOpen) {
    dot.className = "inline-block h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse";
    text.textContent = "🟢 Buka Sekarang · Siap Melayani Pesanan (08:00 – 21:00)";
  } else {
    dot.className = "inline-block h-2.5 w-2.5 rounded-full bg-rose-500";
    text.textContent = "🔴 Sedang Tutup · Buka Kembali Besok Pukul 08:00 WIB";
  }
}

// ===== EVENT LISTENERS (Event Delegation & Handling) =====

// 1. Filter Kategori Tautan
filterTabs.addEventListener("click", function (event) {
  const button = event.target.closest("[data-action='filter']");
  if (button === null) return;
  setState({ activeCategory: button.dataset.category });
});

// 2. Filter Kategori Produk Galeri / Katalog
if (productFilterTabs) {
  productFilterTabs.addEventListener("click", function (event) {
    const button = event.target.closest("[data-action='filter-product']");
    if (button === null) return;
    setState({ activeProductCategory: button.dataset.category });
  });
}

// 3. Pencarian Cepat (Live Search)
if (searchInput) {
  searchInput.addEventListener("input", function (event) {
    setState({ searchQuery: event.target.value });
  });
}

// 4. Tombol Toggle Tema (Mode Gelap/Terang)
themeToggle.addEventListener("click", function () {
  const newTheme = state.theme === "dark" ? "light" : "dark";
  try {
    localStorage.setItem("linkpage:theme", newTheme);
  } catch (err) {
    console.warn("Storage error", err);
  }
  setState({ theme: newTheme });
  showToast(newTheme === "dark" ? "🌙 Mode Gelap diaktifkan" : "☀️ Mode Terang diaktifkan");
});

// 5. Inovasi: Tombol Bagikan / Salin Link Profil UMKM
const shareBtn = document.querySelector("#share-btn");
if (shareBtn) {
  shareBtn.addEventListener("click", async function () {
    const shareData = {
      title: "Rasa Nusantara — UMKM Kopi & Kudapan",
      text: "Kunjungi tautan resmi dan katalog Rasa Nusantara!",
      url: window.location.href
    };

    if (navigator.share && window.location.protocol.startsWith("http")) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        // Fallback jika dialog share dibatalkan
      }
    }

    try {
      await navigator.clipboard.writeText(window.location.href);
      showToast("📋 Tautan profil UMKM berhasil disalin!");
    } catch (err) {
      showToast("Tautan siap dibagikan!");
    }
  });
}

// 6. Form Tambah Link Baru (Pertemuan 4)
const addLinkForm = document.querySelector("#add-link-form");
const formError = document.querySelector("#form-error");

function showFormError(message) {
  formError.textContent = message;
  formError.classList.remove("hidden");
}

function hideFormError() {
  formError.textContent = "";
  formError.classList.add("hidden");
}

function isValidUrl(url) {
  return (
    url.startsWith("http://") ||
    url.startsWith("https://") ||
    url.startsWith("mailto:") ||
    url.startsWith("wa.me/")
  );
}

function getIconForCategory(cat, title) {
  const t = title.toLowerCase();
  if (t.includes("kopi") || t.includes("coffee")) return "☕";
  if (t.includes("roti") || t.includes("kue") || t.includes("camilan")) return "🥐";
  if (t.includes("shopee") || t.includes("toko") || t.includes("beli")) return "🛍️";
  if (t.includes("whatsapp") || t.includes("wa")) return "💬";
  if (t.includes("lokasi") || t.includes("maps")) return "📍";
  if (cat === "menu") return "🍽️";
  if (cat === "marketplace") return "🏪";
  if (cat === "sosmed") return "📱";
  if (cat === "kontak") return "📞";
  return "🔗";
}

addLinkForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const title = document.querySelector("#link-title").value.trim();
  const subtitle = document.querySelector("#link-subtitle").value.trim();
  let url = document.querySelector("#link-url").value.trim();
  const category = document.querySelector("#link-category").value;

  if (title === "") {
    showFormError("Judul tautan atau produk tidak boleh kosong.");
    return;
  }

  if (url === "") {
    showFormError("Alamat URL tidak boleh kosong.");
    return;
  }

  if (url.startsWith("wa.me/")) {
    url = "https://" + url;
  } else if (!isValidUrl(url)) {
    showFormError("URL harus diawali https://, http://, atau mailto:");
    return;
  }

  hideFormError();
  addLinkForm.reset();

  const newLink = {
    id: Date.now(),
    title: title,
    subtitle: subtitle || "Tautan produk UMKM pilihan",
    url: url,
    category: category,
    icon: getIconForCategory(category, title),
    badge: "Baru ✨"
  };

  setState({ links: [newLink, ...state.links] });
  showToast(`✅ Tautan "${title}" berhasil ditambahkan!`);
});

// ===== DATA DEFAULT UMKM (Fallback jika dibuka via file:// tanpa server) =====
const DEFAULT_UMKM_LINKS = [
  {
    id: 1,
    title: "Pesan Cepat via WhatsApp",
    subtitle: "Order langsung, diskon 10% pesanan pertama",
    url: "https://wa.me/6281234567890?text=Halo%20Rasa%20Nusantara,%20saya%20ingin%20pesan%20menu",
    category: "menu",
    icon: "💬",
    badge: "🔥 Fast Response"
  },
  {
    id: 3,
    title: "Pesan di GoFood & GrabFood",
    subtitle: "Diskon kilat dan gratis ongkir sampai ke lokasimu",
    url: "https://gofood.co.id/kedai-rasa-nusantara",
    category: "menu",
    icon: "🛵",
    badge: "⚡ Promo Ongkir"
  },
  {
    id: 4,
    title: "Shopee Official Store",
    subtitle: "Beli biji kopi sangrai (beans/ground) & frozen food",
    url: "https://shopee.co.id/kedairasanusantara",
    category: "marketplace",
    icon: "🛍️",
    badge: "⭐ Rating 4.9"
  },
  {
    id: 5,
    title: "Tokopedia Official",
    subtitle: "Produk UMKM tersertifikasi Halal & BPOM, promo cashback",
    url: "https://tokopedia.com/kedairasanusantara",
    category: "marketplace",
    icon: "🏪",
    badge: "✨ Bebas Ongkir"
  },
  {
    id: 6,
    title: "Instagram @rasanusantara.id",
    subtitle: "Info promo mingguan, behind the scenes & giveaway",
    url: "https://instagram.com/rasanusantara.id",
    category: "sosmed",
    icon: "📸",
    badge: "📸 12K Followers"
  },
  {
    id: 7,
    title: "TikTok @rasanusantaracoffee",
    subtitle: "Tips seduh kopi rumahan & video seru pembuatan camilan",
    url: "https://tiktok.com/@rasanusantaracoffee",
    category: "sosmed",
    icon: "🎵",
    badge: "🎥 Viral"
  },
  {
    id: 8,
    title: "Lokasi Kedai (Google Maps)",
    subtitle: "Jl. Merdeka No. 45, Bandung · Suasana cozy & WiFi cepat",
    url: "https://maps.google.com/?q=Bandung",
    category: "kontak",
    icon: "📍",
    badge: "🚗 Parkir Luas"
  },
  {
    id: 9,
    title: "Kemitraan & Reseller UMKM",
    subtitle: "Hubungi tim bisnis untuk peluang suplai cafe / reseller",
    url: "mailto:mitra@rasanusantara.id",
    category: "kontak",
    icon: "🤝",
    badge: "💼 Peluang Bisnis"
  }
];

const DEFAULT_PRODUCTS = [
  {
    id: "p1",
    name: "Kopi Susu Gula Aren",
    category: "minuman",
    price: "Rp 18.000",
    badge: "🔥 Terlaris",
    description: "Double espresso kopi robusta-arabica dengan gula aren murni & susu creamy.",
    icon: "☕",
    gradient: "from-amber-700 to-amber-900"
  },
  {
    id: "p2",
    name: "Croissant Coklat Lumer",
    category: "makanan",
    price: "Rp 22.000",
    badge: "🥐 Fresh Baked",
    description: "Pastry renyah berlapis dengan isian coklat Belgia leleh yang melimpah.",
    icon: "🥐",
    gradient: "from-amber-600 to-yellow-800"
  },
  {
    id: "p3",
    name: "Biji Kopi Gayo 200g",
    category: "kopi",
    price: "Rp 65.000",
    badge: "⭐ Grade 1",
    description: "100% Arabica Aceh Gayo medium roast, notes aroma coklat & buah jeruk.",
    icon: "🌿",
    gradient: "from-stone-700 to-stone-900"
  },
  {
    id: "p4",
    name: "Pisang Goreng Madu Wijen",
    category: "makanan",
    price: "Rp 15.000",
    badge: "✨ Favorit",
    description: "Pisang raja manis legit dilapisi karamel madu alami dan taburan wijen sangrai.",
    icon: "🍌",
    gradient: "from-yellow-600 to-amber-700"
  },
  {
    id: "p5",
    name: "Es Coklat Klasik",
    category: "minuman",
    price: "Rp 19.000",
    badge: "🍫 Creamy",
    description: "Coklat murni dari perkebunan lokal Jawa Timur dengan rasa pekat dan legit.",
    icon: "🥤",
    gradient: "from-amber-900 to-stone-900"
  },
  {
    id: "p6",
    name: "Hampers Kopi & Kudapan",
    category: "paket",
    price: "Rp 125.000",
    badge: "🎁 Box Eksklusif",
    description: "Paket hampers 2 varian kopi sangrai + 2 toples kue kering tradisional.",
    icon: "📦",
    gradient: "from-amber-800 to-emerald-900"
  }
];

// ===== PENGAMBILAN DATA (Async/Await Fetch - Pertemuan 4) =====
async function loadLinks() {
  try {
    const response = await fetch("data/links.json");
    if (!response.ok) {
      throw new Error("HTTP error " + response.status);
    }
    const links = await response.json();
    setState({ links: links, status: "ready" });
  } catch (error) {
    console.warn("Fetch links diblokir (file:// / offline), memakai data fallback:", error);
    setState({ links: DEFAULT_UMKM_LINKS, status: "ready" });
  }
}

async function loadProducts() {
  try {
    const response = await fetch("data/products.json");
    if (!response.ok) {
      throw new Error("HTTP error " + response.status);
    }
    const products = await response.json();
    setState({ products: products });
  } catch (error) {
    console.warn("Fetch products diblokir (file:// / offline), memakai data fallback:", error);
    setState({ products: DEFAULT_PRODUCTS });
  }
}

// ===== INISIALISASI / MULAI (Pertemuan 3 & 4) =====
render();
loadLinks();
loadProducts();
updateStoreStatus();

// Stretch Goal Pertemuan 3: Tahun Dinamis di Footer
const yearEl = document.querySelector("#current-year");
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}
