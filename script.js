const SUPABASE_URL = 'https://kejqfatcmxxvjuseikhd.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtlanFmYXRjbXh4dmp1c2Vpa2hkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIzNjExNjksImV4cCI6MjEwNzkzNzE2OX0.uBfqOcLzSC_vdd2xH2U3HHryebZx5Hm6ZhHVcp7EMro';
const myDB = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function loadPublicDirectory() {
    const listContainer = document.getElementById('directory-list');
    const { data: members, error } = await myDB.from('members').select('*').eq('is_approved', true).order('username');

    if (error) {
        listContainer.innerHTML = "<p style='text-align:center; color:red;'>အချက်အလက် ဆွဲထုတ်ရာတွင် အမှားရှိနေပါသည်။ Supabase RLS ကို ပိတ်ထားပေးပါ။</p>";
        return;
    }

    let html = '';
    if (members && members.length > 0) {
        members.forEach(m => {
            let pic = m.profile_url || 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png';
            let soc = m.social_links || {};
            let sss = m.social_screenshots || {};

            let socialBtns = '';
            if(soc.fb) socialBtns += `<div style="margin-bottom:6px;"><span class="social-badge bg-fb"><i class="fa-brands fa-facebook"></i> ${soc.fb}</span> ${sss.fb ? `<button class="btn-ss" onclick="showSSModal('${sss.fb}', 'Facebook SS')">SS</button>` : ''}</div>`;
            if(soc.tg) socialBtns += `<div style="margin-bottom:6px;"><span class="social-badge bg-tg"><i class="fa-brands fa-telegram"></i> ${soc.tg}</span> ${sss.tg ? `<button class="btn-ss" onclick="showSSModal('${sss.tg}', 'Telegram SS')">SS</button>` : ''}</div>`;
            if(soc.viber) socialBtns += `<div style="margin-bottom:6px;"><span class="social-badge bg-viber"><i class="fa-brands fa-viber"></i> ${soc.viber}</span> ${sss.viber ? `<button class="btn-ss" onclick="showSSModal('${sss.viber}', 'Viber SS')">SS</button>` : ''}</div>`;
            if(soc.tt) socialBtns += `<div style="margin-bottom:6px;"><span class="social-badge bg-tt"><i class="fa-brands fa-tiktok"></i> ${soc.tt}</span> ${sss.tt ? `<button class="btn-ss" onclick="showSSModal('${sss.tt}', 'TikTok SS')">SS</button>` : ''}</div>`;
            if(soc.yt) socialBtns += `<div style="margin-bottom:6px;"><span class="social-badge bg-yt"><i class="fa-brands fa-youtube"></i> ${soc.yt}</span> ${sss.yt ? `<button class="btn-ss" onclick="showSSModal('${sss.yt}', 'YouTube SS')">SS</button>` : ''}</div>`;

            if(!socialBtns) socialBtns = `<span style="color:#9ca3af; font-size:13px;">ဆက်သွယ်ရန် လိပ်စာ မထည့်ရသေးပါ။</span>`;

            html += `
            <div class="card">
                <img src="${pic}" class="user-avatar">
                <div style="flex:1;">
                    <h3 style="margin:0 0 8px 0; color:var(--primary);">${m.username}</h3>
                    <div>${socialBtns}</div>
                </div>
            </div>`;
        });
    } else {
        html = "<p style='text-align:center; color:#6b7280;'>တရားဝင် အဖွဲ့ဝင် မရှိသေးပါ။</p>";
    }
    listContainer.innerHTML = html;
}

function showSSModal(base64Img, title) {
    Swal.fire({
        title: title,
        imageUrl: base64Img,
        imageWidth: '100%',
        imageAlt: 'Verification Screenshot',
        confirmButtonColor: '#059669',
        confirmButtonText: 'ပိတ်မည်'
    });
}

loadPublicDirectory();
