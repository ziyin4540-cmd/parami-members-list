const SUPABASE_URL = 'https://kejqfatcmxxvjuseikhd.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtlanFmYXRjbXh4dmp1c2Vpa2hkIiwicm9sZSI6ImFub24iisComposite...'; // (သင့်ရဲ့ မူလ Anon Key အပြည့်အစုံကို ထည့်ပါ)
const myDB = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function loadPublicDirectory() {
    const listContainer = document.getElementById('directory-list');
    
    // Database မှ ခွင့်ပြုပြီးသား (is_approved = true) အဖွဲ့ဝင်များကိုသာ ဆွဲထုတ်မည်
    const { data: members, error } = await myDB.from('members').select('*').eq('is_approved', true).order('username');

    if (error) {
        listContainer.innerHTML = "<p style='text-align:center; color:red;'>အချက်အလက်များ ဆွဲထုတ်ရာတွင် အမှားရှိနေပါသည်။</p>";
        return;
    }

    let html = '';
    if (members && members.length > 0) {
        members.forEach(m => {
            let pic = m.profile_url || 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png';
            let soc = m.social_links || {};
            let ss = m.verification_screenshot;

            let socialBtns = '';
            if(soc.fb) socialBtns += `<span class="social-badge bg-fb"><i class="fa-brands fa-facebook"></i> ${soc.fb}</span>`;
            if(soc.tg) socialBtns += `<span class="social-badge bg-tg"><i class="fa-brands fa-telegram"></i> ${soc.tg}</span>`;
            if(soc.viber) socialBtns += `<span class="social-badge bg-viber"><i class="fa-brands fa-viber"></i> ${soc.viber}</span>`;
            if(soc.tt) socialBtns += `<span class="social-badge bg-tt"><i class="fa-brands fa-tiktok"></i> ${soc.tt}</span>`;
            if(soc.yt) socialBtns += `<span class="social-badge bg-yt"><i class="fa-brands fa-youtube"></i> ${soc.yt}</span>`;

            if(!socialBtns) socialBtns = `<span style="color:#9ca3af; font-size:13px;">ဆက်သွယ်ရန် လိပ်စာ မထည့်ရသေးပါ။</span>`;

            let ssBtn = ss ? `<button class="btn-ss" onclick="showSSModal('${ss}')"><i class="fa-solid fa-image"></i> အကောင့် Screenshot ကြည့်ရန်</button>` : `<span style="color:#ef4444; font-size:12px;">Screenshot မတင်ရသေးပါ</span>`;

            html += `
            <div class="card">
                <img src="${pic}" class="user-avatar" onerror="this.src='https://cdn-icons-png.flaticon.com/512/3135/3135715.png'">
                <div class="info-box">
                    <h3>${m.username}</h3>
                    <div class="social-badges">${socialBtns}</div>
                    <div style="margin-top:8px;">${ssBtn}</div>
                </div>
            </div>`;
        });
    } else {
        html = "<p style='text-align:center; color:#6b7280;'>တရားဝင် အဖွဲ့ဝင် မရှိသေးပါ။</p>";
    }
    listContainer.innerHTML = html;
}

function showSSModal(base64Img) {
    Swal.fire({
        title: 'အကောင့် အတည်ပြု Screenshot',
        imageUrl: base64Img,
        imageWidth: '100%',
        imageAlt: 'Verification Screenshot',
        confirmButtonColor: '#059669',
        confirmButtonText: 'ပိတ်မည်'
    });
}

// Page ဖွင့်သည်နှင့် အချက်အလက်စဆွဲမည်
loadPublicDirectory();
