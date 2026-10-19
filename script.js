const SUPABASE_URL = 'https://kejqfatcmxxvjuseikhd.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtlanFmYXRjbXh4dmp1c2Vpa2hkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIzNjExNjksImV4cCI6MjEwNzkzNzE2OX0.uBfqOcLzSC_vdd2xH2U3HHryebZx5Hm6ZhHVcp7EMro';
const myDB = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let globalMembers = []; // Modal တွင် ပြန်သုံးရန် အဖွဲ့ဝင်ဒေတာ သိမ်းထားမည့် ကိန်းရှင်

async function loadMembersDirectory() {
    const container = document.getElementById('members-grid');
    // Admin မှ အတည်ပြုထားသော အဖွဲ့ဝင်များကိုသာ ပြသမည်
    const { data: members, error } = await myDB.from('members').select('*');

    if (error || !members) {
        container.innerHTML = "<p style='text-align:center; color:red; width: 100%;'>အချက်အလက် ဆွဲထုတ်ရာတွင် အမှားရှိနေပါသည်။</p>";
        return;
    }

    globalMembers = members; // Array ထဲ သိမ်းထားမည်
    let html = '';

    if (members.length > 0) {
        members.forEach((m, index) => {
            let photo = m.profile_url || 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png';
            let name = m.name || 'အမည်မရှိ အဖွဲ့ဝင်';
            let role = m.role || 'ခေါင်းဆောင်/အဖွဲ့ဝင်'; // သို့မဟုတ် DB မှ role
            
            // ဤနေရာတွင် ကတ်အလွတ်သာ ပြမည် (Button များ မပါပါ)၊ နှိပ်လျှင် openMemberDetails() အလုပ်လုပ်မည်
            html += `
            <div class="member-card" onclick="openMemberDetails(${index})">
                <img src="${photo}" onerror="this.src='https://cdn-icons-png.flaticon.com/512/3135/3135715.png'">
                <h3>${name}</h3>
                <p>( ${role} )</p>
                <div style="margin-top: 15px; font-size: 12px; color: #059669; font-weight: bold; background: #ecfdf5; padding: 5px; border-radius: 20px; display: inline-block;">
                    အသေးစိတ် ကြည့်ရန် နှိပ်ပါ
                </div>
            </div>`;
        });
    } else {
        html = "<p style='text-align:center; color:#6b7280; width: 100%;'>အဖွဲ့ဝင် စာရင်း မရှိသေးပါ။</p>";
    }
    container.innerHTML = html;
}

// ကတ်ကို နှိပ်လိုက်သောအခါ Popup Modal ကို ဖွင့်ပေးမည့် Function
function openMemberDetails(index) {
    const m = globalMembers[index];
    
    // ပရိုဖိုင် နှင့် အမည် ထည့်သွင်းခြင်း
    document.getElementById('modal-img').src = m.profile_url || 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png';
    document.getElementById('modal-name').innerText = m.name || 'အမည်မရှိ အဖွဲ့ဝင်';
    document.getElementById('modal-role').innerText = '( ' + (m.role || 'အဖွဲ့ဝင်') + ' )';

    // ဇယားကွက်ဖြင့် Social Links များ ထည့်သွင်းခြင်း
    let socialHtml = '';
    if (m.social_links) {
        try {
            // DB ထဲတွင် JSONB ဖြင့် သိမ်းထားသော လင့်ခ်များကို ဖြေချမည်
            let links = typeof m.social_links === 'string' ? JSON.parse(m.social_links) : m.social_links;
            for (const [platform, link] of Object.entries(links)) {
                socialHtml += `
                <tr>
                    <td><i class="fas fa-link" style="color: #6b7280; margin-right: 5px;"></i> ${platform}</td>
                    <td style="text-align: right;"><a href="${link}" target="_blank">ဆက်သွယ်ရန်</a></td>
                </tr>`;
            }
        } catch (e) { console.log(e); }
    }
    
    if (!socialHtml) {
        socialHtml = "<tr><td colspan='2' style='text-align:center; color: #6b7280;'>ချိတ်ဆက်ထားသော အကောင့်မရှိသေးပါ</td></tr>";
    }
    document.getElementById('modal-social-table').innerHTML = socialHtml;

    // အတည်ပြုချက်ပုံများ (SS) ကို Grid ဖြင့် ထည့်သွင်းခြင်း
    let ssHtml = '';
    if (m.social_screenshots) {
        try {
            let ssArr = typeof m.social_screenshots === 'string' ? JSON.parse(m.social_screenshots) : m.social_screenshots;
            ssArr.forEach(ss => {
                // ပုံကို နှိပ်လိုက်လျှင် ပုံကြီးချဲ့ကြည့်နိုင်ရန် window.open သုံးထားသည်
                ssHtml += `<img src="${ss}" onclick="window.open('${ss}', '_blank')" alt="SS Photo">`;
            });
        } catch (e) { console.log(e); }
    }
    
    if (!ssHtml) {
        ssHtml = "<p style='font-size:13px; color:#6b7280; grid-column: 1 / -1; text-align: center;'>အတည်ပြုချက်ပုံ မရှိသေးပါ</p>";
    }
    document.getElementById('modal-ss-grid').innerHTML = ssHtml;

    // Modal ကို ဖော်ပြမည်
    document.getElementById('member-modal').style.display = 'block';
}

// Modal ကို ပိတ်ရန် Function
function closeModal() {
    document.getElementById('member-modal').style.display = 'none';
}

// အပြင်ဘက်ကို နှိပ်မိလျှင်လည်း Modal ပိတ်သွားစေရန်
window.onclick = function(event) {
    const modal = document.getElementById('member-modal');
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

loadMembersDirectory();
