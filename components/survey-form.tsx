"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  JENIS_PELAYANAN,
  JENIS_KELAMIN,
  PENDIDIKAN,
  PEKERJAAN,
  PERTANYAAN_SKM,
} from "@/lib/types";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import {
  CheckCircle2,
  Loader2,
  AlertCircle,
  User,
  ClipboardList,
} from "lucide-react";

type FormStep = "identitas" | "pertanyaan" | "selesai";

interface ValidationErrors {
  jenisPelayanan?: string;
  jenisPelayananLainnya?: string;
  nama?: string;
  noKtp?: string;
  umur?: string;
  jenisKelamin?: string;
  pendidikan?: string;
  pekerjaan?: string;
}

export function SurveyForm() {
  const router = useRouter();
  const [step, setStep] = useState<FormStep>("identitas");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {}
  );

  // Form data
  const [jenisPelayanan, setJenisPelayanan] = useState("");
  const [jenisPelayananLainnya, setJenisPelayananLainnya] = useState("");
  const [nama, setNama] = useState("");
  const [noKtp, setNoKtp] = useState("");
  const [umur, setUmur] = useState("");
  const [jenisKelamin, setJenisKelamin] = useState("");
  const [pendidikan, setPendidikan] = useState("");
  const [pekerjaan, setPekerjaan] = useState("");
  const [kritikSaran, setKritikSaran] = useState("");
  const [jawaban, setJawaban] = useState<Record<string, number>>({});

  const validateNama = (value: string) => {
    const namaRegex = /^[a-zA-Z\s]+$/;
    if (!value.trim()) {
      return "Nama wajib diisi";
    }
    if (!namaRegex.test(value)) {
      return "Nama hanya boleh mengandung huruf dan spasi";
    }
    if (value.trim().length < 3) {
      return "Nama minimal 3 karakter";
    }
    if (value.replace(/\s/g, "").length < 2) {
      return "Nama harus mengandung minimal 2 huruf";
    }
    return "";
  };

  const validateKtp = (value: string) => {
    const ktpRegex = /^\d{16}$/;
    if (!value) {
      return "No. KTP wajib diisi";
    }
    if (!ktpRegex.test(value)) {
      return "No. KTP harus 16 digit angka";
    }
    return "";
  };

  const validateUmur = (value: string) => {
    const umurNum = Number.parseInt(value);
    if (!value) {
      return "Umur wajib diisi";
    }
    if (isNaN(umurNum) || umurNum < 15) {
      return "Umur minimal 15 tahun";
    }
    if (umurNum > 100) {
      return "Umur maksimal 100 tahun";
    }
    return "";
  };

  const handleNamaChange = (value: string) => {
    const filteredValue = value.replace(/[^a-zA-Z\s]/g, "");
    setNama(filteredValue);
    const error = validateNama(filteredValue);
    setValidationErrors((prev) => ({ ...prev, nama: error }));
  };

  const handleKtpChange = (value: string) => {
    const filteredValue = value.replace(/\D/g, "").slice(0, 16);
    setNoKtp(filteredValue);
    const error = validateKtp(filteredValue);
    setValidationErrors((prev) => ({ ...prev, noKtp: error }));
  };

  const handleUmurChange = (value: string) => {
    const filteredValue = value.replace(/\D/g, "").slice(0, 3);
    setUmur(filteredValue);
    const error = validateUmur(filteredValue);
    setValidationErrors((prev) => ({ ...prev, umur: error }));
  };

  const handleJawabanChange = (key: string, value: number) => {
    setJawaban((prev) => ({ ...prev, [key]: value }));
  };

  const isPertanyaanValid = PERTANYAAN_SKM.every((p) => jawaban[p.key]);

  const handleNextToQuestions = () => {
    const errors: ValidationErrors = {
      jenisPelayanan: !jenisPelayanan ? "Jenis pelayanan wajib dipilih" : "",
      jenisPelayananLainnya:
        jenisPelayanan === "lainnya" && !jenisPelayananLainnya
          ? "Mohon isi jenis pelayanan lainnya"
          : "",
      nama: validateNama(nama),
      noKtp: validateKtp(noKtp),
      umur: validateUmur(umur),
      jenisKelamin: !jenisKelamin ? "Jenis kelamin wajib dipilih" : "",
      pendidikan: !pendidikan ? "Pendidikan wajib dipilih" : "",
      pekerjaan: !pekerjaan ? "Pekerjaan wajib dipilih" : "",
    };

    setValidationErrors(errors);

    const hasErrors = Object.values(errors).some((e) => e);
    if (!hasErrors) {
      setStep("pertanyaan");
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      const supabase = getSupabaseBrowserClient();

      const finalJenisPelayanan =
        jenisPelayanan === "lainnya" ? jenisPelayananLainnya : jenisPelayanan;

      const { error: submitError } = await supabase.from("surveys").insert({
        jenis_kegiatan: finalJenisPelayanan,
        nama,
        no_ktp: noKtp,
        umur: Number.parseInt(umur),
        jenis_kelamin: jenisKelamin,
        pendidikan,
        pekerjaan,
        kritik_saran: kritikSaran || null,
        u1: jawaban.u1,
        u2: jawaban.u2,
        u3: jawaban.u3,
        u4: jawaban.u4,
        u5: jawaban.u5,
        u6: jawaban.u6,
        u7: jawaban.u7,
        u8: jawaban.u8,
        u9: jawaban.u9,
      });

      if (submitError) throw submitError;

      setStep("selesai");
    } catch (err) {
      console.error(err);
      setError("Gagal mengirim survey. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (step === "selesai") {
      // Tunggu 3 detik (3000ms) sebelum balik otomatis
      const timer = setTimeout(() => {
        // 1. Reset semua data form jadi kosong lagi
        setJenisPelayanan("");
        setJenisPelayananLainnya("");
        setNama("");
        setNoKtp("");
        setUmur("");
        setJenisKelamin("");
        setPendidikan("");
        setPekerjaan("");
        setKritikSaran("");
        setJawaban({});
        setValidationErrors({});
        setError("");

        // 2. Balikin ke halaman Data Diri
        setStep("identitas");

        // 3. Scroll ke paling atas biar rapi
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 3000); // <-- Angka 3000 ini durasi (3 detik). Bisa lu ganti sesuka hati.

      // Bersihin timer biar ga error
      return () => clearTimeout(timer);
    }
  }, [step]);

  const ErrorMessage = ({ message }: { message?: string }) => {
    if (!message) return null;
    return (
      <p className="flex items-center gap-1 text-sm text-destructive mt-1">
        <AlertCircle className="h-3 w-3" />
        {message}
      </p>
    );
  };

  if (step === "selesai") {
    return (
      // 1. Container Utama: Kasih animasi Zoom In & Fade In pas muncul
      <div className="flex items-center justify-center min-h-[400px] animate-in fade-in zoom-in-95 duration-500">
        <Card className="border-green-200 bg-green-50/50 shadow-lg max-w-lg w-full">
          <CardContent className="flex flex-col items-center py-12 text-center">
            {/* 2. Animasi Icon: Mantul-mantul (Bounce) & Muncul (Scale In) */}
            <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-green-100 animate-in zoom-in duration-500 delay-150">
              {/* Efek Ping (Gelombang) di belakang icon */}
              <div className="absolute inset-0 rounded-full bg-green-400 opacity-20 animate-ping" />
              <CheckCircle2 className="h-12 w-12 text-green-600 drop-shadow-sm" />
            </div>

            {/* 3. Animasi Teks: Muncul dari bawah (Slide Up) dengan delay biar gantian */}
            <div className="animate-in slide-in-from-bottom-4 fade-in duration-700 delay-300">
              <h2 className="mt-6 text-3xl font-bold text-green-800 tracking-tight">
                Terima Kasih!
              </h2>
              <p className="mt-3 text-green-700/80 max-w-md mx-auto text-lg leading-relaxed">
                Data Anda telah kami terima. Masukan Anda sangat berarti bagi
                kemajuan layanan kami.
              </p>
            </div>

            {/* 4. Indikator Balik Otomatis */}
            <div className="mt-8 flex items-center gap-2 text-sm text-green-600/70 bg-green-100/50 px-4 py-2 rounded-full animate-pulse delay-700 duration-1000">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Kembali ke menu utama dalam 3 detik...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center gap-4">
        {[
          { key: "identitas", label: "Data Diri", icon: User },
          { key: "pertanyaan", label: "Pertanyaan SKM", icon: ClipboardList },
        ].map((s, i) => (
          <div key={s.key} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors ${
                  step === s.key
                    ? "bg-primary text-primary-foreground"
                    : ["identitas", "pertanyaan"].indexOf(step) > i
                    ? "bg-green-500 text-white"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                <s.icon className="h-5 w-5" />
              </div>
              <span
                className={`text-xs font-medium ${
                  step === s.key ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {s.label}
              </span>
            </div>
            {i < 1 && (
              <div
                className={`h-1 w-12 sm:w-24 mx-2 rounded ${
                  ["identitas", "pertanyaan"].indexOf(step) > i
                    ? "bg-green-500"
                    : "bg-muted"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {step === "identitas" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Data Diri Responden
            </CardTitle>
            <CardDescription>
              Lengkapi data diri dan pilih jenis pelayanan yang telah Anda
              terima
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Jenis Pelayanan Dropdown */}
            <div className="space-y-2">
              <Label>
                Jenis Pelayanan <span className="text-destructive">*</span>
              </Label>
              <Select
                value={jenisPelayanan}
                onValueChange={(value) => {
                  setJenisPelayanan(value);
                  if (value !== "lainnya") setJenisPelayananLainnya("");
                  setValidationErrors((prev) => ({
                    ...prev,
                    jenisPelayanan: "",
                  }));
                }}
              >
                <SelectTrigger
                  className={`w-full ${
                    validationErrors.jenisPelayanan ? "border-destructive" : ""
                  }`}
                >
                  <SelectValue placeholder="Pilih jenis pelayanan" />
                </SelectTrigger>
                <SelectContent>
                  {JENIS_PELAYANAN.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <ErrorMessage message={validationErrors.jenisPelayanan} />
            </div>

            {/* Input Lainnya */}
            {jenisPelayanan === "lainnya" && (
              <div className="space-y-2">
                <Label>
                  Sebutkan Jenis Pelayanan{" "}
                  <span className="text-destructive">*</span>
                </Label>
                <Input
                  placeholder="Masukkan jenis pelayanan..."
                  value={jenisPelayananLainnya}
                  onChange={(e) => {
                    setJenisPelayananLainnya(e.target.value);
                    setValidationErrors((prev) => ({
                      ...prev,
                      jenisPelayananLainnya: "",
                    }));
                  }}
                  className={
                    validationErrors.jenisPelayananLainnya
                      ? "border-destructive"
                      : ""
                  }
                />
                <ErrorMessage
                  message={validationErrors.jenisPelayananLainnya}
                />
              </div>
            )}

            <div className="border-t pt-5">
              <div className="grid gap-4 sm:grid-cols-2">
                {/* 1. NAMA (Full Lebar) */}
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="nama">
                    Nama Lengkap <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="nama"
                    placeholder="Contoh: Fadhil Firdaus"
                    value={nama}
                    onChange={(e) => handleNamaChange(e.target.value)}
                    className={
                      validationErrors.nama ? "border-destructive" : ""
                    }
                  />
                  <ErrorMessage message={validationErrors.nama} />
                  <p className="text-xs text-muted-foreground">
                    Hanya huruf, tanpa angka atau simbol
                  </p>
                </div>

                {/* 2. KTP (Full Lebar) */}
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="ktp">
                    No. KTP <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="ktp"
                    placeholder="Contoh: 3201234567890123"
                    value={noKtp}
                    onChange={(e) => handleKtpChange(e.target.value)}
                    className={`w-full ${
                      validationErrors.noKtp ? "border-destructive" : ""
                    }`}
                    inputMode="numeric"
                  />
                  <ErrorMessage message={validationErrors.noKtp} />
                  <p className="text-xs text-muted-foreground">
                    {noKtp.length}/16 digit
                  </p>
                </div>

                {/* 3. UMUR (Setengah) */}
                <div className="space-y-2">
                  <Label htmlFor="umur">
                    Umur <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="umur"
                    placeholder="Contoh: 25"
                    value={umur}
                    onChange={(e) => handleUmurChange(e.target.value)}
                    className={
                      validationErrors.umur ? "border-destructive" : ""
                    }
                    inputMode="numeric"
                  />
                  <ErrorMessage message={validationErrors.umur} />
                  <p className="text-xs text-muted-foreground">
                    Minimal 15 tahun
                  </p>
                </div>

                {/* 4. JENIS KELAMIN (Setengah - Dropdown) */}
                <div className="space-y-2">
                  <Label>
                    Jenis Kelamin <span className="text-destructive">*</span>
                  </Label>
                  <Select value={jenisKelamin} onValueChange={setJenisKelamin}>
                    {/* NAH INI KUNCINYA: w-full */}
                    <SelectTrigger
                      className={`w-full ${
                        validationErrors.jenisKelamin
                          ? "border-destructive"
                          : ""
                      }`}
                    >
                      <SelectValue placeholder="Pilih jenis kelamin" />
                    </SelectTrigger>
                    <SelectContent>
                      {JENIS_KELAMIN.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <ErrorMessage message={validationErrors.jenisKelamin} />
                </div>

                {/* 5. PENDIDIKAN (Setengah - Dropdown) */}
                <div className="space-y-2">
                  <Label>
                    Pendidikan Terakhir{" "}
                    <span className="text-destructive">*</span>
                  </Label>
                  <Select value={pendidikan} onValueChange={setPendidikan}>
                    {/* NAH INI KUNCINYA: w-full */}
                    <SelectTrigger
                      className={`w-full ${
                        validationErrors.pendidikan ? "border-destructive" : ""
                      }`}
                    >
                      <SelectValue placeholder="Pilih pendidikan" />
                    </SelectTrigger>
                    <SelectContent>
                      {PENDIDIKAN.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <ErrorMessage message={validationErrors.pendidikan} />
                </div>

                {/* 6. PEKERJAAN (Setengah - Dropdown) */}
                <div className="space-y-2">
                  <Label>
                    Pekerjaan <span className="text-destructive">*</span>
                  </Label>
                  <Select value={pekerjaan} onValueChange={setPekerjaan}>
                    {/* NAH INI KUNCINYA: w-full */}
                    <SelectTrigger
                      className={`w-full ${
                        validationErrors.pekerjaan ? "border-destructive" : ""
                      }`}
                    >
                      <SelectValue placeholder="Pilih pekerjaan" />
                    </SelectTrigger>
                    <SelectContent>
                      {PEKERJAAN.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <ErrorMessage message={validationErrors.pekerjaan} />
                </div>
              </div>
            </div>

            <Button
              className="w-full mt-4"
              size="lg"
              onClick={handleNextToQuestions}
            >
              Lanjutkan ke Pertanyaan
            </Button>
          </CardContent>
        </Card>
      )}

      {step === "pertanyaan" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5" />
              Pertanyaan Survey Kepuasan
            </CardTitle>
            <CardDescription>
              Berikan penilaian untuk setiap pertanyaan berikut
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {PERTANYAAN_SKM.map((pertanyaan, index) => (
              <div
                key={pertanyaan.key}
                className="space-y-4 rounded-xl border bg-muted/30 p-5"
              >
                <p className="font-medium text-foreground leading-relaxed">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm mr-2">
                    {index + 1}
                  </span>
                  {pertanyaan.label}
                </p>
                <RadioGroup
                  value={jawaban[pertanyaan.key]?.toString()}
                  onValueChange={(value) =>
                    handleJawabanChange(pertanyaan.key, Number.parseInt(value))
                  }
                  className="grid grid-cols-2 gap-3 sm:grid-cols-4"
                >
                  {pertanyaan.opsi.map((opsi) => {
                    let colorClass =
                      "peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10"; // Default

                    if (opsi.value === 1) {
                      colorClass =
                        "peer-data-[state=checked]:border-red-500 peer-data-[state=checked]:bg-red-50 peer-data-[state=checked]:text-red-700";
                    } else if (opsi.value === 2) {
                      colorClass =
                        "peer-data-[state=checked]:border-orange-500 peer-data-[state=checked]:bg-orange-50 peer-data-[state=checked]:text-orange-700";
                    } else if (opsi.value === 3) {
                      colorClass =
                        "peer-data-[state=checked]:border-blue-500 peer-data-[state=checked]:bg-blue-50 peer-data-[state=checked]:text-blue-700";
                    } else if (opsi.value === 4) {
                      colorClass =
                        "peer-data-[state=checked]:border-green-600 peer-data-[state=checked]:bg-green-100 peer-data-[state=checked]:text-green-800";
                    }

                    return (
                      <div key={opsi.value}>
                        <RadioGroupItem
                          value={opsi.value.toString()}
                          id={`${pertanyaan.key}-${opsi.value}`}
                          className="peer sr-only"
                        />
                        <Label
                          htmlFor={`${pertanyaan.key}-${opsi.value}`}
                          className={`flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-border bg-background p-4 cursor-pointer transition-all hover:bg-muted hover:scale-105 peer-data-[state=checked]:shadow-md ${colorClass}`}
                        >
                          <span className="text-3xl">{opsi.emoji}</span>
                          <span className="text-xs text-center font-medium leading-tight">
                            {opsi.label}
                          </span>
                        </Label>
                      </div>
                    );
                  })}
                </RadioGroup>
              </div>
            ))}

            <div className="space-y-2 pt-4">
              <Label htmlFor="kritik">Kritik dan Saran (Opsional)</Label>
              <Textarea
                id="kritik"
                placeholder="Tuliskan kritik dan saran Anda untuk peningkatan layanan..."
                value={kritikSaran}
                onChange={(e) => setKritikSaran(e.target.value)}
                rows={4}
                className="resize-none"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-lg">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <Button variant="outline" onClick={() => setStep("identitas")}>
                Kembali
              </Button>
              <Button
                className="flex-1"
                size="lg"
                disabled={!isPertanyaanValid || loading}
                onClick={handleSubmit}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Mengirim...
                  </>
                ) : (
                  "Kirim Survey"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
