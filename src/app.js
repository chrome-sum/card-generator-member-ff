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
          <p id="single-status" class="status-message hidden text-xs font-bold rounded-xl px-4 py-3"></p>
          <button id="btn-single" type="button" class="action-button w-full bg-gray-900 text-white font-black py-4 rounded-xl hover:bg-black transition-all text-[11px] uppercase tracking-[0.3em]">
            Download Card (PNG)
          </button>
        </div>

        <div id="panel-bulk" class="hidden space-y-4">
          <textarea id="bulk-data" rows="4" class="form-control w-full p-4 bg-gray-50 border border-gray-200 rounded-xl font-mono text-xs outline-none focus:ring-2 focus:ring-[#00E5FF] focus:border-[#00E5FF] transition" placeholder="HASBI, 628123, Ciamis"></textarea>
          <p class="text-[11px] text-gray-500 leading-relaxed">Format per baris: <span class="font-mono font-bold">Nama, WhatsApp, Alamat</span></p>
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
            <div class="absolute top-0 left-0 w-8 h-full bg-[#00E5FF]"></div>

            <div class="relative h-full flex flex-col p-14 pl-24 z-10">
              <div class="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-6 w-full">
                <div class="flex items-center gap-6 min-w-0">
                  <div class="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center shadow-lg shrink-0 overflow-hidden">
                    <img src="/logo-abc.png" alt="Logo ABC Jaya" class="w-full h-full object-cover">
                  </div>
                  <div class="brand-pill bg-gray-100 px-6 py-3 rounded-2xl border-2 border-gray-200 pr-8 min-w-0">
                    <h2 class="text-3xl font-black text-gray-900 tracking-tight leading-none uppercase whitespace-nowrap">FROZEN FOOD</h2>
                  </div>
                </div>

                <div class="bg-[#FF007F] px-10 py-5 rounded-3xl shadow-xl rotate-2 shrink-0">
                  <span class="text-white text-4xl font-black italic tracking-widest uppercase">Member</span>
                </div>
              </div>

              <div class="mt-12 grid grid-cols-[minmax(0,1fr)_230px] gap-8 items-start w-full">
                <div class="info-stack space-y-8 pr-4">
                  <div class="bg-gray-50/50 p-8 rounded-[40px] border-2 border-gray-50">
                    <p class="text-lg font-bold text-[#FF007F] uppercase tracking-[0.4em] mb-2">Nama Member</p>
                    <h1 id="card-name" class="name-text text-[60px] font-black text-gray-900 uppercase leading-[1.08] max-w-full whitespace-nowrap">Hayley</h1>
                  </div>

                  <div class="phone-shell bg-gray-50/80 p-6 rounded-[30px] border-2 border-gray-100 flex items-center gap-6">
                    <div class="w-14 h-14 rounded-full bg-[#25D366] flex items-center justify-center text-white shadow-lg shrink-0">
                      <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                    </div>
                    <span id="card-phone" class="phone-text block text-4xl font-extrabold text-gray-800 tracking-tight whitespace-nowrap">+62 812-3456-7890</span>
                  </div>
                </div>

                <div class="qr-card-box text-center shrink-0">
                  <p class="text-gray-400 font-black text-[10px] uppercase tracking-[0.4em] mb-4">Scan WA</p>
                  <div class="border-[4px] border-gray-900 p-2 rounded-[24px] bg-white inline-block">
                    <canvas id="qrcode" width="175" height="175"></canvas>
                  </div>
                  <p class="text-[#00E5FF] font-black text-[10px] uppercase tracking-[0.5em] mt-4">Connect</p>
                </div>
              </div>

              <div class="absolute bottom-14 left-24 right-14">
                <div class="footer-shell bg-gray-900 py-4 px-10 rounded-2xl flex items-center gap-6 shadow-xl border-l-8 border-[#00E5FF]">
                  <div class="shrink-0">
                    <svg class="w-8 h-8 text-[#00E5FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z"></path></svg>
                  </div>
                  <span id="card-address" class="address-text flex-1 text-[24px] text-white font-bold tracking-wide uppercase leading-none whitespace-nowrap">Panjalu, Ciamis - Jawa Barat</span>
                </div>
              </div>
            </div>

            <div class="absolute -bottom-20 -right-20 w-80 h-80 bg-gray-50 rounded-full opacity-50"></div>
          </div>
        </div>
        <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest italic">Full Stability Export Update - V4.0 build by <span class="text-indigo-800"><a href="https://hasbi-alajiz.my.id">Hasbie</a></span></p>
      </div>
    </div>
  `;
}
