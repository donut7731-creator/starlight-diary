import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

export default function App() {
  const [activeChart, setActiveChart] = useState('Birth Chart');
  const [fullName, setFullName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState('');
  const [birthLocation, setBirthLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [profiles, setProfiles] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);

  // ปรับเมนูให้เหลือเฉพาะส่วนที่ทำงานได้แม่นยำ 100%
  const chartCategories = ['Birth Chart', '📚 คู่มือโหราศาสตร์'];
  const popularLocations = ['Krabi, Thailand', 'Bangkok, Thailand', 'Phuket, Thailand', 'Chiang Mai, Thailand'];

  const astrologyGuideData = {
    houses: [
      { num: 1, name: "เรือนที่ 1 (First House - Ascendant)", desc: "ลัคนา, รูปลักษณ์ภายนอก, บุคลิกภาพที่แสดงออกต่อสาธารณชน และความประทับใจแรกพบ" },
      { num: 2, name: "เรือนที่ 2 (Second House)", desc: "การเงิน, ทรัพย์สินส่วนบุคคล, คุณค่าในตัวเอง และความมั่นคงทางวัตถุ" },
      { num: 3, name: "เรือนที่ 3 (Third House)", desc: "การสื่อสาร, การเรียนรู้ระยะสั้น, พี่น้อง, เพื่อนบ้าน และการเดินทางใกล้ๆ" },
      { num: 4, name: "เรือนที่ 4 (Fourth House - IC)", desc: "รากฐานชีวิต, ครอบครัว, บ้านเรือน, ความเป็นอยู่ภายใน และจิตใต้สำนึกส่วนลึก" },
      { num: 5, name: "เรือนที่ 5 (Fifth House)", desc: "ความคิดสร้างสรรค์, ความรักแบบโรแมนติก, การเสี่ยงโชค, ความสนุกสนาน และบุตร" },
      { num: 6, name: "เรือนที่ 6 (Sixth House)", desc: "สุขภาพ, กิจวัตรประจำวัน, งานบริการ, สัตว์เลี้ยง และภาระหน้าที่ในชีวิตประจำวัน" },
      { num: 7, name: "เรือนที่ 7 (Seventh House - Descendant)", desc: "คู่ครอง, หุ้นส่วนทางธุรกิจ, การสมรส และปฏิสัมพันธ์แบบตัวต่อตัวกับผู้อื่น" },
      { num: 8, name: "เรือนที่ 8 (Eighth House)", desc: "มรดก, ทรัพย์สินร่วมกัน, ความลับ, เรื่องเพศ, และการเปลี่ยนแปลงครั้งใหญ่ (Transformation)" },
      { num: 9, name: "เรือนที่ 9 (Ninth House)", desc: "การศึกษาขั้นสูง, ปรัชญา, ศาสนา, การเดินทางไกล และต่างประเทศ" },
      { num: 10, name: "เรือนที่ 10 (Tenth House - Midheaven)", desc: "อาชีพการงาน, ชื่อเสียง, เกียรติยศ, ความสำเร็จ และสถานะทางสังคมสูงสุด" },
      { num: 11, name: "เรือนที่ 11 (Eleventh House)", desc: "เพื่อนฝูง, สังคม, เครือข่าย, ความหวัง, ความฝัน และเป้าหมายในอนาคต" },
      { num: 12, name: "เรือนที่ 12 (Twelfth House)", desc: "จิตวิญญาณ, ความสันโดษ, ความลับที่ซ่อนอยู่, กรรมเก่า และการเยียวยาภายใน" }
    ],
    planets: [
      { name: "Sun (ดวงอาทิตย์)", desc: "แก่นแท้ของตัวตน, อัตตา, เป้าหมายชีวิต และพลังงานหลัก" },
      { name: "Moon (ดวงจันทร์)", desc: "อารมณ์, ความรู้สึก, สัญชาตญาณ และโลกภายในจิตใจ" },
      { name: "Mercury (ดาวพุธ)", desc: "การคิดวิเคราะห์, การเจรจาต่อรอง, ภาษา และการสื่อสาร" },
      { name: "Venus (ดาวศุกร์)", desc: "ความรัก, ความสวยงาม, สุนทรียภาพ, ความสุขสำราญ และการเงิน" },
      { name: "Mars (ดาวอังคาร)", desc: "พลังขับเคลื่อน, ความกล้าหาญ, ความเร่าร้อน, การกระทำ และการแข่งขัน" }
    ]
  };

  const handleCalculate = async () => {
    if (!fullName || !birthDate || !birthTime || !birthLocation) {
      alert('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }
    setLoading(true);
    const [year, month, day] = birthDate.split('-');
    const [hour, minute] = birthTime.split(':');

    const options = {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'X-RapidAPI-Key': 'a2065afc1cmsh8c5fc26dd571d3ap15b196jsna57a2054cffc',
        'X-RapidAPI-Host': 'astrologer.p.rapidapi.com'
      },
      body: JSON.stringify({
        subject: {
          name: fullName,
          year: parseInt(year),
          month: parseInt(month),
          day: parseInt(day),
          hour: parseInt(hour),
          minute: parseInt(minute),
          city: birthLocation.split(',')[0].trim(),
          nation: 'TH',
          longitude: 98.9063,
          latitude: 8.0863,
          timezone: 'Asia/Bangkok',
          zodiac_type: 'Tropical',
          houses_system_identifier: 'P'
        },
        theme: 'classic',
        language: 'EN',
        split_chart: false,
        transparent_background: false,
        show_house_position_comparison: true,
        custom_title: `${fullName}'s Birth Chart`,
        active_points: ["Sun", "Moon", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune", "Pluto", "Chiron", "Lilith", "north_node"],
        active_aspects: [
          { name: "conjunction", orb: 8 },
          { name: "opposition", orb: 8 },
          { name: "trine", orb: 8 },
          { name: "square", orb: 8 },
          { name: "sextile", orb: 6 }
        ]
      })
    };

    try {
      const response = await fetch('https://astrologer.p.rapidapi.com/api/v5/chart/birth-chart', options);
      const result = await response.json();
      
      const { data, error } = await supabase.from('user_profiles').insert([{
        full_name: fullName,
        birth_date: birthDate,
        birth_time: birthTime,
        birth_location: birthLocation,
        chart_data: result
      }]).select();

      if (error) throw error;
      
      alert('✨ คำนวณและบันทึกสำเร็จ!');
      setFullName('');
      setBirthDate('');
      setBirthTime('');
      setBirthLocation('');
      
      await fetchProfiles();
      if (data && data.length > 0) {
        setSelectedProfile(data[0]);
      }
    } catch (err) {
      console.error(err);
      alert('เกิดข้อผิดพลาดในการดึงข้อมูลจาก API');
    } finally {
      setLoading(false);
    }
  };

  const fetchProfiles = async () => {
    const { data } = await supabase.from('user_profiles').select('*').order('created_at', { ascending: false });
    setProfiles(data || []);
  };

  const handleDeleteProfile = async (id, e) => {
    e.stopPropagation();
    const { error } = await supabase.from('user_profiles').delete().eq('id', id);
    if (!error) {
      if (selectedProfile && selectedProfile.id === id) {
        setSelectedProfile(null);
      }
      fetchProfiles();
    }
  };

  useEffect(() => { fetchProfiles(); }, []);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: "'Mali', cursive, sans-serif" }}>
      <nav style={{ width: '250px', backgroundColor: '#1a202c', color: 'white', padding: '20px', flexShrink: 0 }}>
        <h2 style={{ color: '#a0aec0', marginBottom: '20px' }}>Starlight Diary</h2>
        {chartCategories.map(c => (
          <div key={c} onClick={() => setActiveChart(c)} style={{ padding: '12px 10px', margin: '5px 0', cursor: 'pointer', borderRadius: '6px', backgroundColor: activeChart === c ? '#2d3748' : 'transparent', color: activeChart === c ? '#ecc94b' : 'white' }}>
            {c}
          </div>
        ))}
      </nav>

      <main style={{ flex: 1, padding: '40px', backgroundColor: '#f7fafc', overflowY: 'auto' }}>
        <h1>{activeChart}</h1>
        
        {activeChart === 'Birth Chart' && (
          <>
            <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: '30px' }}>
              <h3>📝 กรอกข้อมูลเพื่อคำนวณดวงชะตา</h3>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>ชื่อเจ้าของดวงชะตา</label>
                <input type="text" placeholder="เช่น คุณโดนัท" value={fullName} onChange={e => setFullName(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e0' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>วันเกิด</label>
                  <input type="date" value={birthDate} onChange={e => setBirthDate(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e0' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>เวลาเกิด</label>
                  <input type="time" value={birthTime} onChange={e => setBirthTime(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e0' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>สถานที่เกิด</label>
                  <input type="text" list="loc-list" placeholder="เช่น Krabi, Thailand" value={birthLocation} onChange={e => setBirthLocation(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e0' }} />
                  <datalist id="loc-list">
                    {popularLocations.map((l, i) => <option key={i} value={l} />)}
                  </datalist>
                </div>
              </div>
              <button onClick={handleCalculate} disabled={loading} style={{ width: '100%', padding: '12px', backgroundColor: '#2b6cb0', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' }}>
                {loading ? 'กำลังเชื่อมต่อดาวเหนือและคำนวณ...' : '✨ คำนวณและบันทึก Chart'}
              </button>
            </div>

            {selectedProfile && (
              <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: '30px', borderTop: '4px solid #3182ce' }}>
                <h3>🌟 ผลลัพธ์ดวงชะตาของ: <span style={{ color: '#2b6cb0' }}>{selectedProfile.full_name}</span></h3>
                <p style={{ color: '#718096' }}>เกิดวันที่: {selectedProfile.birth_date} เวลา {selectedProfile.birth_time} ณ {selectedProfile.birth_location}</p>
                {selectedProfile.chart_data?.chart && (
                  <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                    <h4 style={{ margin: '0 0 10px 0', color: '#2d3748' }}>🪐 แผนผังดวงชะตา (Chart Wheel):</h4>
                    <div dangerouslySetInnerHTML={{ __html: selectedProfile.chart_data.chart }} style={{ maxWidth: '100%', overflowX: 'auto' }} />
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {activeChart === '📚 คู่มือโหราศาสตร์' && (
          <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
            <h2 style={{ color: '#2b6cb0', marginBottom: '10px' }}>📖 คู่มือศึกษาโหราศาสตร์ตะวันตก (Astrology Guide)</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', marginBottom: '40px' }}>
              {astrologyGuideData.houses.map(h => (
                <div key={h.num} style={{ padding: '15px', backgroundColor: '#f7fafc', borderRadius: '8px', borderLeft: '4px solid #3182ce', border: '1px solid #e2e8f0' }}>
                  <h4 style={{ margin: '0 0 8px 0', color: '#2b6cb0' }}>{h.name}</h4>
                  <p style={{ margin: 0, color: '#4a5568', fontSize: '0.9rem', lineHeight: '1.5' }}>{h.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

