export function createAppMarkup() {
  return `
    <div class="min-h-screen flex flex-col items-center py-8 px-4 gap-8">
      <div class="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 w-full max-w-[650px] space-y-6">
        <div class="flex flex-col sm:flex-row justify-between items-center gap-4 border-b border-gray-100 pb-4">
          <div>
            <h1 class="font-bold text-gray-900 text-xl tracking-tight">ABC JAYA CARD</h1>
            <p class="text-[10px] text-gray-400 font-bold tracking-[0.2em] uppercase">Layout Engine v4.0 - Vite Setup</p>
          </div>
          <div class="flex gap-6 text-[11px] font-bold text-gray-400">
            <button type="button" data-tab-trigger="single" id="tab-single" class="tab-button tab-active py-2 transition-all uppercase">Single</button>
            <button type="button" data-tab-trigger="bulk" id="tab-bulk" class="tab-button py-2 transition-all uppercase tracking-widest">Bulk (.ZIP)</button>
          </div>
        </div>

        <div id="panel-single" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="md:col-span-2">
              <label for="input-name" class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 block">Nama Lengkap</label>
              <input type="text" id="input-name" placeholder="M HASBI" class="form-control w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-bold text-sm focus:ring-2 focus:ring-[#00E5FF] focus:border-[#00E5FF] outline-none transition">
            </div>
            <div>
              <label for="input-phone" class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 block">WhatsApp</label>
              <input type="text" id="input-phone" placeholder="628123456789" class="form-control w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-bold text-sm focus:ring-2 focus:ring-[#00E5FF] focus:border-[#00E5FF] outline-none transition">
            </div>
            <div>
              <label for="input-address" class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 block">Wilayah / Alamat</label>
              <input type="text" id="input-address" placeholder="Panjalu, Ciamis" class="form-control w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-bold text-sm focus:ring-2 focus:ring-[#00E5FF] focus:border-[#00E5FF] outline-none transition">
            </div>
          </div>
          <label for="single-use-qr" class="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-bold text-gray-700">
            <input type="checkbox" id="single-use-qr" class="h-4 w-4 accent-gray-900">
            Gunakan QR Code
          </label>
          <p id="single-status" class="status-message hidden text-xs font-bold rounded-xl px-4 py-3"></p>
          <button id="btn-single" type="button" class="action-button w-full bg-gray-900 text-white font-black py-4 rounded-xl hover:bg-black transition-all text-[11px] uppercase tracking-[0.3em]">
            Download Card (PNG)
          </button>
        </div>

        <div id="panel-bulk" class="hidden space-y-4">
          <textarea id="bulk-data" rows="6" class="form-control w-full p-4 bg-gray-50 border border-gray-200 rounded-xl font-mono text-xs outline-none focus:ring-2 focus:ring-[#00E5FF] focus:border-[#00E5FF] transition" placeholder="Nama	WhatsApp	Alamat&#10;Hasbi	628123456789	Ciamis&#10;Sinta		Tasikmalaya"></textarea>
          <p class="text-[11px] text-gray-500 leading-relaxed">Copy tabel dari Excel atau Google Sheets lalu paste di sini. Urutan kolom: <span class="font-mono font-bold">Nama, WhatsApp, Alamat</span>.</p>
          <label for="bulk-use-qr" class="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-bold text-gray-700">
            <input type="checkbox" id="bulk-use-qr" class="h-4 w-4 accent-blue-600">
            Sertakan QR Code di semua kartu
          </label>
          <div id="bulk-preview" class="hidden rounded-2xl border border-gray-200 bg-gray-50 p-4 space-y-3">
            <div class="flex flex-col gap-1">
              <p class="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Preview Parse</p>
              <p id="bulk-summary" class="text-sm font-bold text-gray-700"></p>
            </div>
            <div id="bulk-valid-preview" class="space-y-2"></div>
            <div id="bulk-invalid-preview" class="space-y-2"></div>
          </div>
          <div id="progress-area" class="hidden space-y-1">
            <div class="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
              <div id="progress-bar" class="bg-[#FF007F] h-full" style="width: 0%"></div>
            </div>
            <p id="progress-text" class="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">0%</p>
          </div>
          <p id="bulk-status" class="status-message hidden text-xs font-bold rounded-xl px-4 py-3"></p>
          <button id="btn-bulk" type="button" class="action-button w-full bg-blue-600 text-white font-black py-4 rounded-xl hover:bg-blue-700 transition-all text-[11px] uppercase tracking-[0.3em]">
            Generate ZIP
          </button>
        </div>
      </div>

      <div class="flex flex-col items-center gap-4 w-full">
        <div class="card-wrapper flex justify-center w-full">
          <div id="membership-card" class="preview-scale">
            <div class="accent-line"></div>
            <div class="card-noise"></div>
            <div class="store-bg"></div>
            <div class="gradient-overlay"></div>
            <div class="cyan-glow"></div>
            <div class="pink-glow"></div>

            <div class="content-layer">
              <header class="card-header">
                <div class="brand-chip">
                  <div class="logo-shell">
                    <img src="/logo-abc.png" alt="Logo ABC Jaya" class="h-full w-full object-contain">
                  </div>
                  <div class="brand-copy">
                    <p class="brand-kicker">Frozen Food</p>
                    <h2 class="brand-name">ABC JAYA</h2>
                  </div>
                </div>

                <div class="member-badge">
                  <p class="member-badge-top">Official</p>
                  <p class="member-badge-text">Member</p>
                </div>
              </header>

              <section class="card-body">
                <div class="member-copy">
                  <h1 id="card-name" class="name-text">M HASBI</h1>

                  <div class="phone-row">
                    <div class="phone-icon-shell">
                      <svg class="phone-icon" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                    </div>
                    <div class="phone-copy">
                      <p class="phone-label">WhatsApp</p>
                      <p id="card-phone" class="phone-text">+62 812-3456-7890</p>
                    </div>
                  </div>
                </div>

                <div id="qr-section" class="qr-section hidden">
                  <p class="qr-label">Scan WA</p>
                  <div class="qr-shell">
                    <canvas id="qrcode" width="175" height="175"></canvas>
                  </div>
                </div>
              </section>

              <footer class="footer-address">
                <div class="footer-icon-shell">
                  <svg class="footer-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.4" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z"></path></svg>
                </div>
                <div class="footer-copy">
                  <p class="footer-label">Area</p>
                  <p id="card-address" class="address-text">Panjalu, Ciamis - Jawa Barat</p>
                </div>
              </footer>
            </div>
          </div>
        </div>
      </div>
      <p class="mt-auto pt-8 text-xs sm:text-sm font-bold text-gray-400 uppercase tracking-widest italic text-center">Full Stability Export Update - V4.0 built by <span><a href="https://hasbi-alajiz.my.id" target="_blank" rel="noreferrer" class="text-lime-500 transition-colors hover:text-lime-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 rounded-sm">Hasbie</a></span></p>
    </div>
  `;
}
