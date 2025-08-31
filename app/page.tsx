"use client";
import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Check, Sparkles, Clock, GraduationCap, Rocket, Shield, Phone, Mail, Calendar, ArrowRight } from "lucide-react";
import { u } from "framer-motion/client";

/**
 * Landing: Programación Asistida con IA Generativa (Vibe Coding)
 * - 1-file React component, Tailwind + shadcn/ui
 * - Ready to publish as a static page (e.g., Vercel, Netlify)
 * - Built-in lead form with optional webhook endpoint
 *
 * 🔧 Configura aquí tus datos clave antes de publicar
 */
const CONFIG = {
  COURSE_NAME: "Programación Asistida con IA Generativa (Vibe Coding)",
  TAGLINE: "Aprende a programar desde cero con la ayuda de la IA",
  // ⚠️ Actualiza estas fechas antes de publicar (las actuales son placeholders)
  COURSE_START_DATE: "13 de septiembre de 2025", // Ej: "12 de septiembre de 2025"
  COURSE_DURATION: "4 semanas · 16 horas totales · 100% online en vivo",
  // Precios y preventa (opcional)
  PRESALE_ENABLED: true,
  PRESALE_DEADLINE: "12 de septiembre de 2025", // Ej: "30 de agosto de 2025"
  PRICE_PRESALE: "$399 MXN",
  PRICE_REGULAR: "$499 MXN",
  // Donde recibirás los formularios. Opción A: pega tu endpoint (Formspree, Getform, Tally, etc.)
  FORM_ENDPOINT: process.env.NEXT_PUBLIC_FORM_ENDPOINT || "", // ← leer desde .env.local
  // Opción B (fallback): correo de recepción
  FALLBACK_EMAIL: "18127196yael@gmail.com",
  WHATSAPP_NUMBER: "+52 9941046264", // para CTA directo en WhatsApp
  BRAND: {
    primary: "from-blue-600 to-indigo-600",
    ring: "focus-visible:ring-blue-600",
  },
};

export default function LandingVibeCoding() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  // Simple UTM capture
  const utm = useMemo(() => {
    const p = new URLSearchParams(window.location.search);
    return {
      source: p.get("utm_source") || "",
      medium: p.get("utm_medium") || "",
      campaign: p.get("utm_campaign") || "",
    };
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const payload = Object.fromEntries(form.entries());

    // Client-side validation mínima
    if (!payload.nombre || !payload.email) {
      setError("Por favor, completa al menos tu nombre y correo electrónico.");
      setLoading(false);
      return;
    }

    // Adjunta UTM
    payload.utm_source = utm.source;
    payload.utm_medium = utm.medium;
    payload.utm_campaign = utm.campaign;

    try {
      if (CONFIG.FORM_ENDPOINT) {
        const res = await fetch(CONFIG.FORM_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Error al enviar el formulario");
        setSent(true);
      } else {
        // Fallback: mailto con cuerpo prellenado
        const body = encodeURIComponent(
          `Nueva inscripción a ${CONFIG.COURSE_NAME}%0D%0A%0D%0A` +
          Object.entries(payload)
            .map(([k, v]) => `${k}: ${v}`)
            .join("%0D%0A")
        );
        window.location.href = `mailto:${CONFIG.FALLBACK_EMAIL}?subject=Inscripción%20${encodeURIComponent(
          CONFIG.COURSE_NAME
        )}&body=${body}`;
        setSent(true);
      }
    } catch (err) {
      console.error(err);
      setError("No se pudo enviar. Intenta de nuevo o escribe por WhatsApp.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 text-slate-900">
      {/* Nav */}
      <header className="sticky top-0 z-40 backdrop-blur bg-white/70 border-b">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-600" />
            <span className="font-semibold">Vibe Coding</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a href="#aprenderas" className="hover:underline">¿Qué aprenderás?</a>
            <a href="#metodologia" className="hover:underline">Metodología</a>
            <a href="#temario" className="hover:underline">Temario</a>
            <a href="#precio" className="hover:underline">Precios</a>
            <a href="#inscripcion" className="hover:underline">Inscripción</a>
          </nav>
          <Button asChild className="rounded-2xl">
            <a href="#inscripcion" className="flex items-center gap-1">
              Inscribirme <ArrowRight className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-5xl font-bold leading-tight"
          >
            {CONFIG.COURSE_NAME}
          </motion.h1>
          <p className="mt-4 text-lg text-slate-600">{CONFIG.TAGLINE}</p>
          <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-700">
            <span className="inline-flex items-center gap-2 bg-white border rounded-full px-3 py-1">
              <Calendar className="h-4 w-4 text-blue-600" /> Inicio: {CONFIG.COURSE_START_DATE}
            </span>
            <span className="inline-flex items-center gap-2 bg-white border rounded-full px-3 py-1">
              <Clock className="h-4 w-4 text-blue-600" /> {CONFIG.COURSE_DURATION}
            </span>
            <span className="inline-flex items-center gap-2 bg-white border rounded-full px-3 py-1">
              <GraduationCap className="h-4 w-4 text-blue-600" /> Nivel: Principiantes
            </span>
          </div>
          <div className="mt-8 flex gap-3">
            <Button asChild size="lg" className="rounded-2xl">
              <a href="#inscripcion">Reservar mi lugar</a>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-2xl">
              <a
                href={`https://wa.me/${CONFIG.WHATSAPP_NUMBER.replace(/[^\d]/g, "")}?text=${encodeURIComponent(
                  "Hola, me interesa el curso Vibe Coding. ¿Me compartes detalles?"
                )}`}
                target="_blank"
                rel="noreferrer"
              >
                Consultar por WhatsApp
              </a>
            </Button>
          </div>
          {CONFIG.PRESALE_ENABLED && (
            <p className="mt-3 text-sm text-slate-600">
              🔥 Preventa {CONFIG.PRICE_PRESALE} hasta {CONFIG.PRESALE_DEADLINE}. Precio regular {CONFIG.PRICE_REGULAR}.
            </p>
          )}
        </div>

        <Card className="shadow-xl border-0 bg-white/70 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-xl">Lo que lograrás</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 text-slate-700">
            <LineItem text="Entender los fundamentos de programación y lógica" />
            <LineItem text="Aprender Python desde cero con ejercicios guiados" />
            <LineItem text="Usar IA (ChatGPT y compañía) como copiloto de código" />
            <LineItem text="Resolver retos reales con vibe coding" />
            <LineItem text="Construir tu primer mini proyecto funcional" />
          </CardContent>
        </Card>
      </section>

      {/* ¿Qué aprenderás? */}
      <section id="aprenderas" className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl md:text-3xl font-bold">¿Qué aprenderás?</h2>
        <div className="mt-6 grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            "Pensamiento lógico y resolución de problemas",
            "De binario a lenguajes de alto nivel",
            "Python básico: variables, tipos, control de flujo",
            "Funciones, listas, diccionarios y archivos",
            "Buenas prácticas con IA como asistente",
            "Prompting efectivo para programar más rápido",
            "Mini proyectos con enfoque práctico",
            "Cómo seguir aprendiendo después del curso",
          ].map((t) => (
            <Card key={t}>
              <CardContent className="p-4 text-sm text-slate-700 flex items-start gap-2">
                <Check className="h-4 w-4 mt-0.5 text-blue-600" /> {t}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Metodología Vibe Coding */}
      <section id="metodologia" className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-6 items-center">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">Metodología Vibe Coding</h2>
            <p className="mt-3 text-slate-700">
              Aprenderás haciendo. Usamos IA para acelerar el aprendizaje, desbloquear ideas y practicar de forma guiada
              sin abrumarte. Clases en vivo, acompañamiento, y ejercicios cortos para progresar desde el día 1.
            </p>
            <ul className="mt-4 space-y-2 text-slate-700 text-sm">
              <li className="flex gap-2"><Rocket className="h-4 w-4 text-blue-600" /> Micro-retos prácticos en cada clase</li>
              <li className="flex gap-2"><Shield className="h-4 w-4 text-blue-600" /> Código seguro y buenas prácticas con IA</li>
              <li className="flex gap-2"><Sparkles className="h-4 w-4 text-blue-600" /> Plantillas reutilizables y prompts</li>
            </ul>
          </div>
          <Card className="border-dashed">
            <CardHeader>
              <CardTitle className="text-lg">Formato del curso</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-700 grid gap-2">
              <LineItem text="2 clases por semana (en vivo)" />
              <LineItem text="Grabaciones disponibles para repaso" />
              <LineItem text="Grupo de soporte y dudas" />
              <LineItem text="Material descargable (diapositivas y notebooks)" />
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Temario resumido */}
      <section id="temario" className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl md:text-3xl font-bold">Temario resumido</h2>
        <div className="mt-6 grid md:grid-cols-2 gap-4 text-sm text-slate-700">
          <Card>
            <CardHeader><CardTitle>Módulo 1 · Introducción</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              <Bullet>¿Qué es programar y cómo piensa una computadora?</Bullet>
              <Bullet>De binario a Python: el camino rápido</Bullet>
              <Bullet>Entorno de trabajo con VS Code</Bullet>
              <Bullet>Primer script con IA</Bullet>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Módulo 2 · Python desde cero</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              <Bullet>Variables, tipos, operadores</Bullet>
              <Bullet>Condicionales y bucles</Bullet>
              <Bullet>Estructuras de datos: listas y diccionarios</Bullet>
              <Bullet>Funciones, módulos y archivos</Bullet>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Módulo 3 · Vibe Coding con IA</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              <Bullet>Prompting para código y depuración</Bullet>
              <Bullet>Patrones rápidos: scripts útiles con IA</Bullet>
              <Bullet>Buenas prácticas y ética</Bullet>
              <Bullet>Mini proyecto guiado</Bullet>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Módulo 4 · Proyecto final</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              <Bullet>Definición del problema</Bullet>
              <Bullet>Desarrollo con IA como copiloto</Bullet>
              <Bullet>Presentación de resultados</Bullet>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Precios */}
      <section id="precio" className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl md:text-3xl font-bold">Inscripción y precios</h2>
        <div className="mt-6 grid md:grid-cols-2 gap-6">
          <Card className="border-2 border-blue-600">
            <CardHeader>
              <CardTitle>Preventa</CardTitle>
            </CardHeader>
            <CardContent className="text-slate-700">
              <p className="text-3xl font-bold">{CONFIG.PRICE_PRESALE}</p>
              <p className="text-sm mt-1">Hasta {CONFIG.PRESALE_DEADLINE}</p>
              <ul className="mt-4 space-y-2 text-sm">
                <Bullet>Incluye acceso completo al curso</Bullet>
                <Bullet>Grupo de soporte y grabaciones</Bullet>
                <Bullet>Certificado de finalización</Bullet>
              </ul>
              <Button asChild className="mt-6 w-full rounded-2xl">
                <a href="#inscripcion">Aprovechar preventa</a>
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Precio regular</CardTitle>
            </CardHeader>
            <CardContent className="text-slate-700">
              <p className="text-3xl font-bold">{CONFIG.PRICE_REGULAR}</p>
              <p className="text-sm mt-1">Después de la preventa</p>
              <ul className="mt-4 space-y-2 text-sm">
                <Bullet>Acceso completo a todas las clases</Bullet>
                <Bullet>Materiales y grabaciones</Bullet>
                <Bullet>Soporte por 4 semanas</Bullet>
              </ul>
              <Button asChild variant="outline" className="mt-6 w-full rounded-2xl">
                <a href="#inscripcion">Inscribirme</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Formulario */}
      <section id="inscripcion" className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-8 items-start">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">Reserva tu lugar</h2>
            <p className="mt-2 text-slate-700">
              Completa el formulario y te enviaremos los pasos para finalizar tu inscripción. Cupo limitado.
            </p>
            <div className="mt-6 space-y-2 text-sm text-slate-600">
              <p className="flex items-center gap-2"><Mail className="h-4 w-4" /> Te contactaremos por correo</p>
              <p className="flex items-center gap-2"><Phone className="h-4 w-4" /> Podemos confirmar por WhatsApp</p>
            </div>
          </div>

          <Card className="shadow-xl">
            <CardContent className="pt-6">
              {sent ? (
                <div className="text-center py-10">
                  <h3 className="text-xl font-semibold">¡Gracias por registrarte! 🎉</h3>
                  <p className="mt-2 text-slate-700">
                    Te enviaremos un mensaje con los detalles y pasos de pago. Si no lo ves en 5 minutos, revisa spam o
                    escríbenos por WhatsApp.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="grid gap-4">
                  <div>
                    <label className="text-sm font-medium">Nombre completo *</label>
                    <Input name="nombre" placeholder="Tu nombre" required />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Correo electrónico *</label>
                      <Input type="email" name="email" placeholder="tucorreo@email.com" required />
                    </div>
                    <div>
                      <label className="text-sm font-medium">WhatsApp</label>
                      <Input name="whatsapp" placeholder="+52 55..." />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Ocupación</label>
                      <Input name="ocupacion" placeholder="Prepa / Uni / Profesional" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Experiencia en programación</label>
                      <Input name="experiencia" placeholder="Ninguna / Básica / Intermedia" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">¿Por qué quieres tomar el curso?</label>
                    <Textarea name="motivo" placeholder="Cuéntanos en 1-2 líneas" rows={3} />
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <input type="checkbox" name="consent" required className="mt-1" />
                    <p>Acepto ser contactad@ para completar mi inscripción. <span className="underline">Aviso de privacidad</span>.</p>
                  </div>
                  {error && <p className="text-sm text-red-600">{error}</p>}
                  <Button type="submit" disabled={loading} className={`rounded-2xl ${CONFIG.BRAND.ring}`}>
                    {loading ? "Enviando..." : "Enviar registro"}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-6xl mx-auto px-4 pb-20">
        <h2 className="text-2xl md:text-3xl font-bold">Preguntas frecuentes</h2>
        <div className="mt-6 grid md:grid-cols-2 gap-6 text-sm text-slate-700">
          <Faq q="¿Necesito experiencia previa?" a="No. Empezamos desde cero y usamos IA para apoyarte en cada paso." />
          <Faq q="¿Las clases quedan grabadas?" a="Sí, tendrás acceso a las grabaciones durante el curso para repaso." />
          <Faq q="¿Qué herramientas usaremos?" a="Principalmente VS Code, Python y ChatGPT u otras IA equivalentes." />
          <Faq q="¿Entregarán certificado?" a="Sí, al completar el 80% del curso y el mini proyecto final." />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white/70">
        <div className="max-w-6xl mx-auto px-4 py-10 text-sm text-slate-600 grid md:grid-cols-2 gap-6 items-center">
          <p>© {new Date().getFullYear()} Vibe Coding · Todos los derechos reservados</p>
          <div className="flex md:justify-end gap-4">
            <a className="hover:underline" href="#">Aviso de privacidad</a>
            <a className="hover:underline" href={`https://wa.me/${CONFIG.WHATSAPP_NUMBER.replace(/[^\d]/g, "")}`} target="_blank" rel="noreferrer">WhatsApp</a>
            <a className="hover:underline" href={`mailto:${CONFIG.FALLBACK_EMAIL}`}>Contacto</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function LineItem({ text }) {
  return (
    <div className="flex items-start gap-2">
      <Check className="h-4 w-4 mt-0.5 text-blue-600" />
      <span className="text-sm">{text}</span>
    </div>
  );
}

function Bullet({ children }) {
  return (
    <div className="flex items-start gap-2">
      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-blue-600"></span>
      <span>{children}</span>
    </div>
  );
}

function Faq({ q, a }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{q}</CardTitle>
      </CardHeader>
      <CardContent className="text-slate-700">{a}</CardContent>
    </Card>
  );
}
