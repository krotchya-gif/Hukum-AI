import { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { ContactForm } from "@/components/kontak/ContactForm";

export const metadata: Metadata = {
  title: "Kontak | HukumAI",
  description: "Hubungi tim HukumAI untuk pertanyaan, saran, atau kerja sama.",
};

export default async function KontakPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isID = locale === "id";

  return (
    <div className="container py-12 max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-display font-bold text-primary mb-4">
          {isID ? "Hubungi Kami" : "Contact Us"}
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {isID
            ? "Punya pertanyaan, saran, atau ingin bekerja sama? Jangan ragu untuk menghubungi kami."
            : "Have questions, suggestions, or want to collaborate? Don't hesitate to contact us."}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Contact Info */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-6">
                {isID ? "Informasi Kontak" : "Contact Information"}
              </h2>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Mail className="size-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Email</p>
                    <a href="mailto:info@hukumai.id" className="text-muted-foreground hover:text-primary">
                      info@hukumai.id
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Phone className="size-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{isID ? "Telepon" : "Phone"}</p>
                    <a href="tel:+622112345678" className="text-muted-foreground hover:text-primary">
                      +62 21 1234 5678
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <MapPin className="size-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{isID ? "Alamat" : "Address"}</p>
                    <p className="text-muted-foreground">
                      {isID
                        ? "Jl. Sudirman No. 123, Jakarta Selatan 12190"
                        : "123 Sudirman Street, South Jakarta 12190"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Clock className="size-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{isID ? "Jam Operasional" : "Business Hours"}</p>
                    <p className="text-muted-foreground">
                      {isID
                        ? "Senin - Jumat: 09:00 - 17:00 WIB"
                        : "Monday - Friday: 09:00 - 17:00 WIB"}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact Form */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-6">
              {isID ? "Kirim Pesan" : "Send Message"}
            </h2>

            <ContactForm isID={isID} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
