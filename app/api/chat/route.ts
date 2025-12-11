import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

// Database RAG lengkap Kantor Pertanahan Kabupaten Grobogan
const BPN_GROBOGAN_RAG = `
# DATABASE PENGETAHUAN: KANTOR PERTANAHAN KAB. GROBOGAN

## 1. PROFIL & IDENTITAS RESMI
- Nama Unit Kerja: Kantor Pertanahan Kabupaten Grobogan (Kementerian ATR/BPN).
- Kepala Kantor (Terbaru 2025): Bapak Buchori Sugiharso, A.Ptnh., S.H., M.Kn. (Menjabat sejak Juli 2025, menggantikan Ibu Siti Aisyah).
- Motto Pelayanan: "Melayani, Profesional, Terpercaya".
- Visi: Terwujudnya Penataan Ruang dan Pengelolaan Pertanahan yang Terpercaya dan Berstandar Dunia.
- Alamat: Jl. Jend Sudirman No.47, Jajar, Purwodadi, Kec. Purwodadi, Kabupaten Grobogan, Jawa Tengah 58111.

## 2. KONTAK & KANAL PENGADUAN (HALO KAKANTAH)
- Telepon Kantor: (0292) 421376.
- Hotline Khusus (WhatsApp): 0823-2088-8815. Disebut layanan "Halo Kakantah" - Saluran pengaduan cepat respon.
- Email Resmi: kab-grobogan@atrbpn.go.id.
- Media Sosial Resmi:
  - Instagram: @atr.bpngrobogan
  - Facebook: Kantah Kabupaten Grobogan / atr.bpngrobogan
  - Twitter (X): @atr_bpngrobogan
  - YouTube: KantahKabupatenGrobogan

## 3. JAM OPERASIONAL & LAYANAN EKSTRA (INOVASI)

### A. Jam Kerja Reguler
- Senin - Kamis: 08.00 - 16.00 WIB.
- Jumat: 08.00 - 16.30 WIB.

### B. PELATARAN (Pelayanan Tanah Akhir Pekan) - INOVASI
Layanan khusus bagi pemohon yang mengurus sendiri (TANPA KUASA/CALO).
- Hari: Sabtu & Minggu.
- Jam: 09.00 - 12.00 WIB.
- Lokasi: Loket Pelayanan Kantor Pertanahan Kab. Grobogan.
- Jenis Layanan: Pengecekan sertifikat, konsultasi, dan pendaftaran layanan tertentu.

### C. RALALI (Roya Layanan Lima Menit) - BARU 2025
Inovasi unggulan Kanwil Jateng yang berlaku di Grobogan sejak Juni 2025.
- Definisi: Layanan penghapusan hak tanggungan (Roya) yang selesai dalam waktu 5 menit.
- Syarat Khusus:
  1. Pemohon datang langsung (tanpa kuasa).
  2. Dokumen lengkap (Sertifikat, SHT, Surat Lunas).
  3. Sudah membayar SPS (Surat Perintah Setor).

## 4. JENIS LAYANAN & PERSYARATAN LENGKAP

### A. Layanan Pendaftaran Tanah (Rutin)
1. Jual Beli (Balik Nama):
   - Syarat: Sertifikat asli, AJB dari PPAT, KTP/KK Penjual-Pembeli, Bukti Bayar PPh & BPHTB, SPPT PBB tahun berjalan.
2. Waris:
   - Syarat: Sertifikat asli, Surat Keterangan Waris (Desa/Camat/Notaris), KTP/KK seluruh ahli waris, Bukti BPHTB Waris.
3. Hibah:
   - Syarat: Sertifikat asli, Akta Hibah PPAT, KTP/KK Pemberi & Penerima Hibah, Bukti PPh & BPHTB.

### B. Sertifikat Hilang & Rusak
1. Sertifikat Hilang:
   - Wajib lapor polisi (Polres/Polsek) untuk dapat Surat Kehilangan.
   - Sumpah di hadapan Kepala Kantor BPN.
   - Pengumuman di koran selama 30 hari (biaya sendiri).
2. Sertifikat Rusak:
   - Wajib membawa serpihan/sisa fisik sertifikat yang rusak.

### C. Program Strategis (PTSL)
- PTSL (Pendaftaran Tanah Sistematis Lengkap): Fokus BPN Grobogan saat ini adalah penyelesaian "Desa Lengkap" & pemetaan KW456.
- Penting: Pendaftaran PTSL HANYA melalui Panitia Ajudikasi di Kantor Desa/Kelurahan lokasi tanah, tidak bisa daftar perorangan langsung ke kantor BPN.

## 5. BIAYA & CARA HITUNG (PNBP)
Sesuai PP No. 128 Tahun 2015

- Rumus Biaya Balik Nama: (Nilai Tanah (ZNT) / 1000) + Rp 50.000.
  Catatan: Nilai tanah berbasis ZNT (Zona Nilai Tanah) BPN, biasanya lebih tinggi dari NJOP PBB.
- Biaya Pengecekan: Rp 50.000 per bidang.
- Biaya Hak Tanggungan (Hutang Bank):
  - Nilai tanggungan s.d Rp 250 juta: Rp 50.000.
  - Nilai lebih dari Rp 250 juta s.d Rp 1 Miliar: Rp 200.000.
  - Nilai lebih dari Rp 1 Miliar s.d Rp 10 Miliar: Rp 2.500.000.

## 6. APLIKASI DIGITAL PENDUKUNG
- Sentuh Tanahku: Wajib install untuk cek status berkas & plot bidang tanah.
- BHUMI: Portal peta online (bhumi.atrbpn.go.id) untuk melihat sebaran bidang tanah.

## 7. FAQ (Pertanyaan Sering Diajukan)
Q: Apakah bisa diwakilkan?
A: Bisa, dengan Surat Kuasa bermaterai. TAPI, disarankan urus sendiri (Layanan Mandiri) untuk bisa akses layanan prioritas seperti PELATARAN (Sabtu-Minggu) dan RALALI (Roya 5 Menit).

Q: Berapa lama sertifikat jadi?
A: Tergantung jenis layanan.
   - Roya & Pengecekan: 1 hari kerja (bisa 5 menit jika RALALI).
   - Balik Nama/Peralihan: Standar 5 hari kerja (jika berkas lengkap).
   - Sertifikat Hilang: Minimal 40 hari (karena ada masa pengumuman koran 30 hari).

Q: Apa itu ZNT?
A: Zona Nilai Tanah. Peta harga tanah wajar yang dibuat BPN sebagai dasar penarikan PNBP.
`;

interface ImageData {
  data: string;
  mimeType: string;
}

export async function POST(request: Request) {
  try {
    const { message, images } = await request.json() as {
      message: string;
      images?: ImageData[]
    };

    if (!message && (!images || images.length === 0)) {
      return NextResponse.json(
        { error: 'Message or images are required' },
        { status: 400 }
      );
    }

    // Create system prompt dengan data RAG untuk Kantor Pertanahan Kab. Grobogan
    const systemPrompt = `Kamu adalah asisten virtual resmi Kantor Pertanahan Kabupaten Grobogan (BPN Grobogan), Kementerian ATR/BPN.

ATURAN PENTING YANG WAJIB DIPATUHI:
1. HANYA jawab pertanyaan berdasarkan data berikut ini untuk pertanyaan tentang BPN. JANGAN menjawab di luar konteks data yang diberikan untuk topik BPN.
2. Jika pertanyaan tentang BPN tidak ada dalam data, jawab dengan sopan: "Mohon maaf, saya tidak memiliki informasi tentang hal tersebut. Silakan hubungi langsung Kantor Pertanahan Kabupaten Grobogan di nomor (0292) 421376 atau WhatsApp 0823-2088-8815 untuk informasi lebih lanjut."
3. Jawab dengan bahasa yang natural, ramah, dan mudah dipahami seperti berbicara dengan manusia.
4. JANGAN PERNAH menggunakan tanda bintang ganda (**) atau formatting markdown dalam jawaban. Gunakan teks biasa saja.
5. Jangan gunakan bullet points dengan tanda *, gunakan tanda - atau nomor saja.
6. Jawab dengan singkat, padat, dan informatif.
7. Selalu tampilkan diri sebagai representasi profesional dari Kantor Pertanahan Kabupaten Grobogan.

KEMAMPUAN ANALISIS GAMBAR/DOKUMEN:
8. Jika pengguna mengirim gambar atau dokumen, WAJIB analisis dengan teliti dan deskriptif.
9. Untuk gambar sertifikat tanah, identifikasi: nomor sertifikat, nama pemegang hak, lokasi tanah, luas tanah, jenis hak (HM/HGB/HP dll), dan informasi penting lainnya yang tertera.
10. Untuk dokumen lainnya, baca dan jelaskan isi dokumen tersebut dengan lengkap.
11. Jika gambar tidak jelas atau tidak dapat dibaca, sampaikan dengan sopan dan minta gambar yang lebih jelas.
12. PENTING: Deskripsikan ISI dari gambar/dokumen, BUKAN nama file-nya.

DATA REFERENSI:
${BPN_GROBOGAN_RAG}

Berdasarkan data di atas, jawab pertanyaan berikut dengan natural dan ramah:`;

    // Build content parts for multimodal request
    const contentParts: Array<{ text: string } | { inlineData: { mimeType: string; data: string } }> = [];

    // Add images first if present
    if (images && images.length > 0) {
      for (const image of images) {
        contentParts.push({
          inlineData: {
            mimeType: image.mimeType,
            data: image.data
          }
        });
      }
    }

    // Build the text prompt
    let textPrompt = systemPrompt + '\n\n';

    if (images && images.length > 0) {
      textPrompt += `[Pengguna mengirim ${images.length} gambar/dokumen untuk dianalisis]\n\n`;
    }

    if (message) {
      textPrompt += `Pertanyaan dari masyarakat: ${message}\n\n`;
    } else if (images && images.length > 0) {
      textPrompt += `Pertanyaan dari masyarakat: Tolong analisis dan jelaskan isi dari gambar/dokumen yang saya kirim ini.\n\n`;
    }

    textPrompt += 'Jawaban (dalam bahasa Indonesia, natural, tanpa formatting markdown):';

    contentParts.push({ text: textPrompt });

    // Generate response using Gemini 2.5 Flash with vision capability
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{
        role: 'user',
        parts: contentParts
      }],
    });

    // Clean response dari karakter ** jika masih ada
    let cleanedResponse = response.text || '';
    cleanedResponse = cleanedResponse.replace(/\*\*/g, '');
    cleanedResponse = cleanedResponse.replace(/\*/g, '-');

    return NextResponse.json({
      message: cleanedResponse,
      success: true
    });

  } catch (error) {
    console.error('Error generating response:', error);
    return NextResponse.json(
      { error: 'Failed to generate response', success: false },
      { status: 500 }
    );
  }
}
