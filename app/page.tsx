"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Check,
  Clock,
  GraduationCap,
  Rocket,
  Shield,
  Phone,
  Mail,
  Calendar,
  ArrowRight,
  Sparkles,
  MessageCircle,
} from "lucide-react";

/**
 * Landing — Programación Asistida con IA Generativa (Vibe Coding)
 * Tema claro con alto contraste, logo local en /public, envío a correo + WhatsApp,
 * honeypot antispam y UTM. Tipado para build limpio.
 */
const CONFIG = {
  COURSE_NAME: "Programación Asistida con IA Generativa (Vibe Coding)",
  TAGLINE: "Aprende a programar desde cero con la ayuda de la IA",
  COURSE_START_DATE: "13 de septiembre de 2025",
  COURSE_DURATION: "4 semanas · 16 horas totales · 100% online en vivo",

  PRESALE_ENABLED: true,
  PRESALE_DEADLINE: "08 de septiembre de 2025",
  PRICE_PRESALE: "$399 MXN",
  PRICE_REGULAR: "$499 MXN",

  // Recomendado: variable de entorno NEXT_PUBLIC_FORM_ENDPOINT (Formspree/Getform/Tally)
  FORM_ENDPOINT: process.env.NEXT_PUBLIC_FORM_ENDPOINT || "",
  FALLBACK_EMAIL: "18127196yael@gmail.com",
  WHATSAPP_NUMBER: "+52 2202397660",

  BRAND: {
    primary: "from-indigo-600 to-purple-600",
    ring: "focus-visible:ring-indigo-600",
  },
};

export default function LandingVibeCoding() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  // Estado inicial sin tocar SSR
  const [utm, setUtm] = useState({ source: "", medium: "", campaign: "" });

  useEffect(() => {
    // Esto solo corre en el cliente
    const p = new URLSearchParams(window.location.search);
    setUtm({
      source: p.get("utm_source") || "",
      medium: p.get("utm_medium") || "",
      campaign: p.get("utm_campaign") || "",
    });
  }, []);


  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const entries = Array.from(form.entries()) as [string, FormDataEntryValue][];
    const payload: Record<string, string> = Object.fromEntries(
      entries.map(([k, v]) => [k, typeof v === "string" ? v : ""])
    );

    if (!payload.nombre || !payload.email) {
      setError("Por favor, completa al menos tu nombre y correo electrónico.");
      setLoading(false);
      return;
    }

    payload.utm_source = utm.source;
    payload.utm_medium = utm.medium;
    payload.utm_campaign = utm.campaign;

    // Honeypot: si está lleno, ignorar (probable bot)
    if (payload._hpt && payload._hpt.trim() !== "") {
      setLoading(false);
      setSent(true);
      return;
    }

    try {
      if (CONFIG.FORM_ENDPOINT) {
        const res = await fetch(CONFIG.FORM_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const data = (await res.json().catch(() => null)) as { error?: string } | null;
          throw new Error(data?.error || "Error al enviar el formulario");
        }

      } else {
        const body = encodeURIComponent(
          `Nueva inscripción a ${CONFIG.COURSE_NAME}\n\n` +
            Object.entries(payload).map(([k, v]) => `${k}: ${v}`).join("\n")
        );
        window.location.href = `mailto:${CONFIG.FALLBACK_EMAIL}?subject=Inscripción%20${encodeURIComponent(
          CONFIG.COURSE_NAME
        )}&body=${body}`;
      }

      // Abre WhatsApp con el resumen (el usuario confirma el envío)
      const wpText =
        `Nueva inscripción a ${CONFIG.COURSE_NAME}\n` +
        `Nombre: ${payload.nombre || ""}\n` +
        `Email: ${payload.email || ""}\n` +
        (payload.whatsapp ? `WhatsApp: ${payload.whatsapp}\n` : "") +
        (payload.ocupacion ? `Ocupación: ${payload.ocupacion}\n` : "") +
        (payload.experiencia ? `Experiencia: ${payload.experiencia}\n` : "") +
        (payload.motivo ? `Motivo: ${payload.motivo}\n` : "") +
        (utm.source || utm.medium || utm.campaign
          ? `UTM → source:${utm.source} | medium:${utm.medium} | campaign:${utm.campaign}\n`
          : "");
      const waHref = `https://wa.me/${CONFIG.WHATSAPP_NUMBER.replace(/[^\d]/g, "")}?text=${encodeURIComponent(
        wpText
      )}`;
      window.open(waHref, "_blank");

      setSent(true);
    } catch (err) {
      console.error(err);
      setError("No se pudo enviar. Intenta de nuevo o escribe por WhatsApp.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-white via-indigo-50 to-purple-50 text-slate-900">
      <LightGradientBackground />

      {/* NAV */}
      <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/80 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/vibe_coding_logo_circular.ico"
              alt="Vibe Coding Logo"
              width={50}
              height={50}
              className="rounded-full shadow"
              priority
            />
            <span className="font-semibold tracking-wide">Vibe Coding</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-slate-700">
            <a href="#aprenderas" className="hover:text-slate-900">¿Qué aprenderás?</a>
            <a href="#metodologia" className="hover:text-slate-900">Metodología</a>
            <a href="#temario" className="hover:text-slate-900">Temario</a>
            <a href="#temario-detallado" className="hover:text-slate-900">Temario detallado</a>
            <a href="#precio" className="hover:text-slate-900">Precios</a>
            <a href="#inscripcion" className="hover:text-slate-900">Inscripción</a>
          </nav>
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" className="rounded-2xl">
              <a
                href={`https://wa.me/${CONFIG.WHATSAPP_NUMBER.replace(/[^\d]/g, "")}?text=${encodeURIComponent(
                  "Hola, me interesa el curso Vibe Coding. ¿Me compartes detalles?"
                )}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1"
              >
                <MessageCircle className="h-4 w-4" /> WhatsApp
              </a>
            </Button>
            <Button asChild className="rounded-2xl">
              <a href="#inscripcion" className="flex items-center gap-1">
                Inscribirme <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative max-w-7xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl font-black leading-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-indigo-700 to-purple-700"
          >
            {CONFIG.COURSE_NAME}
            
          </motion.h1>
          <p className="mt-4 text-lg text-slate-700">{CONFIG.TAGLINE}</p>

          <div className="mt-6 flex flex-wrap gap-3 text-sm">
            <Badge icon={<Calendar className="h-4 w-4" />}>Inicio: {CONFIG.COURSE_START_DATE}</Badge>
            <Badge icon={<Clock className="h-4 w-4" />}>{CONFIG.COURSE_DURATION}</Badge>
            <Badge icon={<GraduationCap className="h-4 w-4" />}>Nivel: Principiantes</Badge>
          </div>

          {CONFIG.PRESALE_ENABLED && (
            <p className="mt-4 text-sm text-slate-700">
              🔥 Preventa <b>{CONFIG.PRICE_PRESALE}</b> hasta <b>{CONFIG.PRESALE_DEADLINE}</b>. Precio regular {CONFIG.PRICE_REGULAR}.
            </p>
          )}

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

          <div className="mt-8 flex items-center gap-3 text-slate-600 text-sm">
          </div>
        </div>

        {/* Hero illustration card */}
        <Card className="shadow-xl border border-slate-200 bg-white/90 backdrop-blur">
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
      <section id="aprenderas" className="relative max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-slate-900">¿Qué aprenderás?</h2>
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
            <Card key={t} className="border border-slate-200 bg-white">
              <CardContent className="p-4 text-sm text-slate-700 flex items-start gap-2">
                <Check className="h-4 w-4 mt-0.5 text-indigo-600" /> {t}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Metodología */}
      <section id="metodologia" className="relative max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-6 items-center">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Metodología Vibe Coding</h2>
            <p className="mt-3 text-slate-700">
              Aprenderás haciendo. Usamos IA para acelerar el aprendizaje, desbloquear ideas y practicar de forma guiada
              sin abrumarte. Clases en vivo, acompañamiento, y ejercicios cortos para progresar desde el día 1.
            </p>
            <ul className="mt-4 space-y-2 text-slate-700 text-sm">
              <li className="flex gap-2"><Rocket className="h-4 w-4 text-indigo-600" /> Micro-retos prácticos en cada clase</li>
              <li className="flex gap-2"><Shield className="h-4 w-4 text-indigo-600" /> Código seguro y buenas prácticas con IA</li>
              <li className="flex gap-2"><Sparkles className="h-4 w-4 text-indigo-600" /> Plantillas reutilizables y prompts</li>
            </ul>
          </div>
          <Card className="border-dashed border-slate-300 bg-white">
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


      {/* Temario DETALLADO */}
      <section id="temario-detallado" className="relative max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-slate-900">Temario</h2>
        <div className="mt-6 grid md:grid-cols-2 gap-6">
          {/* Módulo 1 */}
          <Accordion
            title="Módulo 1: Introducción a la programación y a Python"
            items={[
              "¿Qué es programar? ¿Por qué importa?",
              "¿Cómo piensa una computadora? (del código binario a los lenguajes de alto nivel)",
              "Pensamiento lógico y resolución de problemas",
              "¿Por qué Python para este curso? Ventajas y aplicaciones",
              "Instalación de entorno de trabajo y primer contacto (VS Code)",
              "Variables, tipos de datos y operadores en Python",
              "🧪 Ejercicio con IA: pedirle a la IA un programa que imprima tu nombre",
            ]}
          />
          {/* Módulo 2 */}
          <Accordion
            title="Módulo 2: Control de flujo y estructuras básicas"
            items={[
              "Condicionales en Python: if, else, elif",
              "Bucles: for, while",
              "Listas, diccionarios y estructuras de datos comunes",
              "Ejercicios prácticos con pseudocódigo y Python",
              "🧪 Ejercicio con IA: programa que pregunte tu edad y dé una respuesta según el valor",
            ]}
          />
          {/* Módulo 3 */}
          <Accordion
            title="Módulo 3: Funciones y modularidad"
            items={[
              "¿Qué es una función y por qué usarla?",
              "Parámetros y retorno de valores en Python",
              "Buenas prácticas: escribir código limpio y reutilizable",
              "🧪 Ejercicio con IA: convertir un código repetitivo en funciones",
            ]}
          />
          {/* Módulo 4 */}
          <Accordion
            title="Módulo 4: Depuración y lectura de código"
            items={[
              "Cómo leer código generado por IA",
              "Identificación de errores comunes en Python",
              "Uso de print(), try/except, pruebas básicas",
              "Uso de IA como apoyo en la depuración",
            ]}
          />
          {/* Módulo 5 */}
          <Accordion
            title="Módulo 5: Introducción al vibecoding"
            items={[
              "¿Qué es vibecoding y cómo se diferencia del código tradicional?",
              "Plataformas y herramientas disponibles (Copilot, ChatGPT, Replit, etc.)",
              "Cómo escribir prompts efectivos para generar código útil",
              "Taller: transformar un mal prompt en un buen prompt",
            ]}
          />
          {/* Módulo 6 */}
          <Accordion
            title="Módulo 6: Vibecoding aplicado"
            items={[
              "Crear proyectos simples con IA (calculadora, app de clima, chatbot)",
              "Analizar y corregir el código generado",
              "Combinar vibecoding con conocimientos previos para mejorar resultados",
              "Proyecto colaborativo ligero (juego o bot en equipo pequeño)",
            ]}
          />
          {/* Módulo 7 */}
          <Accordion
            title="Módulo 7: Proyecto final + visión de futuro"
            items={[
              "Cada alumno elige un proyecto personal",
              "Desarrollo usando vibecoding + fundamentos aprendidos",
              "Presentación grupal con pitch breve",
              "🚀 ¿Qué sigue después del curso?: bases de datos, desarrollo web y proyectos avanzados",
            ]}
          />
        </div>
      </section>

      {/* Precios */}
      <section id="precio" className="relative max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-slate-900">Inscripción y precios</h2>
        <div className="mt-6 grid md:grid-cols-2 gap-6">
          <Card className="border-2 border-indigo-300 bg-white">
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
          <Card className="bg-white border border-slate-200">
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
      <section id="inscripcion" className="relative max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-8 items-start">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Reserva tu lugar</h2>
            <p className="mt-2 text-slate-700">
              Completa el formulario o contactanos por WhatsApp y te enviaremos los pasos para finalizar tu inscripción. Cupo limitado.
            </p>
            <div className="mt-6 space-y-2 text-sm text-slate-600">
              <p className="flex items-center gap-2"><Mail className="h-4 w-4 text-indigo-600" /> Te contactaremos por correo</p>
              <p className="flex items-center gap-2"><Phone className="h-4 w-4 text-indigo-600" /> Podemos confirmar por WhatsApp</p>
              <Button
                asChild
                size="lg"
                className="rounded-2xl flex items-center gap-2 border-green-500 text-green-700 hover:bg-green-50 shadow-lg text-base px-8 py-4 transition-transform hover:scale-105"
                style={{
                  fontWeight: 700,
                  fontSize: "1.25rem",
                  borderWidth: 2,
                  boxShadow: "0 4px 24px 0 rgba(34,197,94,0.10)",
                }}
              >
                <a
                  href={`https://wa.me/${CONFIG.WHATSAPP_NUMBER.replace(/[^\d]/g, "")}?text=${encodeURIComponent(
                    "Hola, quiero más información sobre el curso Vibe Coding."
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 32 32"
                    width={28}
                    height={28}
                    className="inline-block mr-2"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <circle cx="16" cy="16" r="16" fill="#25D366" />
                    <path
                      d="M23.6 18.9c-.4-.2-2.3-1.1-2.6-1.2-.3-.1-.5-.2-.7.2-.2.4-.7 1.2-.9 1.4-.2.2-.3.3-.7.1-.4-.2-1.5-.6-2.8-1.8-1-1-1.7-2.2-1.9-2.6-.2-.4 0-.6.2-.8.2-.2.4-.5.6-.7.2-.2.2-.4.3-.7 0-.2 0-.5-.1-.7-.1-.2-.7-1.7-1-2.3-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.7.3-.2.2-1 1-1 2.4 0 1.4 1 2.7 1.1 2.9.1.2 2 3.1 4.8 4.2.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.6-.1 1.8-.7 2-1.4.2-.7.2-1.3.1-1.4-.1-.1-.3-.2-.7-.4z"
                      fill="#fff"
                    />
                  </svg>
                  <span>Contactar por WhatsApp</span>
                </a>
              </Button>
            
            {/* REDES SOCIALES*/}
            <div className="flex gap-6 mt-6 justify-center">
            <a
              href="https://x.com/yaelv2711?s=11"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
              className="hover:scale-110 transition-transform"
            >
            <svg width={50} height={50} viewBox="0 0 40 40" fill="none">
              <circle cx="20" cy="20" r="20" fill="#000"/>
              <path
                d="M25.7 13.5h2.6l-5.7 6.5 6.7 8.5h-5.3l-4.2-5.3-4.8 5.3h-2.6l6-6.7-6.5-8.3h5.3l3.8 4.8 4.4-4.8zm-1 13.6h1.5l-4.7-6-1.3 1.4 4.5 5.6zm-7.7-13.6h-1.5l4.5 5.7 1.3-1.4-4.3-5.3z"
                fill="#fff"
              />
            </svg>
            </a>
          
            <a
              href="https://www.linkedin.com/in/yael-vicente-437467235"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="hover:scale-110 transition-transform"
            >
              <svg width={50} height={50} viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="12" fill="#0077B5" />
              <path
                d="M8.34 17.34H6.16V10.5h2.18v6.84zM7.25 9.5a1.26 1.26 0 110-2.52 1.26 1.26 0 010 2.52zm10.09 7.84h-2.18v-3.34c0-.8-.01-1.83-1.12-1.83-1.12 0-1.29.87-1.29 1.77v3.4h-2.18V10.5h2.09v.93h.03c.29-.55 1-1.12 2.06-1.12 2.2 0 2.6 1.45 2.6 3.33v3.7z"
                fill="#fff"
              />
              </svg>
            </a>
            <a
              href="https://github.com/Yael27V"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="hover:scale-110 transition-transform"
            >
              <svg width={50} height={50} viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="12" fill="#181717" />
              <path
                d="M12 5.3c-3.7 0-6.7 3-6.7 6.7 0 3 1.9 5.5 4.6 6.4.3.1.4-.1.4-.3v-1.2c-1.9.4-2.3-.8-2.3-.8-.3-.7-.7-.9-.7-.9-.6-.4 0-.4 0-.4.7 0 1 .7 1 .7.6 1 1.6.7 2 .5.1-.4.2-.7.4-.8-1.5-.2-3-.7-3-3.1 0-.7.2-1.2.6-1.7-.1-.2-.3-.8.1-1.6 0 0 .5-.2 1.7.6.5-.1 1-.2 1.5-.2s1 .1 1.5.2c1.2-.8 1.7-.6 1.7-.6.4.8.2 1.4.1 1.6.4.5.6 1 .6 1.7 0 2.4-1.5 2.9-3 3.1.2.2.4.5.4 1v1.5c0 .2.1.4.4.3 2.7-.9 4.6-3.4 4.6-6.4 0-3.7-3-6.7-6.7-6.7z"
                fill="#fff"
              />
              </svg>
            </a>
            <a
              href="https://www.tiktok.com/@yaelvicente315?_t=ZS-8zLiz0r7jWy&_r=1"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
              className="hover:scale-110 transition-transform"
            >
              <svg width={50} height={50} viewBox="0 0 40 40" fill="none">
                <circle cx="20" cy="20" r="20" fill="#000" />
                <path
                  d="M27.5 17.2v2.2c-1.2 0-2.3-.3-3.3-.9v5.1c0 2.5-2 4.5-4.5 4.5s-4.5-2-4.5-4.5 2-4.5 4.5-4.5c.2 0 .5 0 .7.1v2.1c-.2 0-.5-.1-.7-.1-1.3 0-2.4 1.1-2.4 2.4s1.1 2.4 2.4 2.4 2.4-1.1 2.4-2.4v-9.2h2.1c.1 1.2 1.1 2.2 2.3 2.3z"
                  fill="#fff"
                />
                <path
                  d="M27.5 17.2v2.2c-1.2 0-2.3-.3-3.3-.9v5.1c0 2.5-2 4.5-4.5 4.5s-4.5-2-4.5-4.5 2-4.5 4.5-4.5c.2 0 .5 0 .7.1v2.1c-.2 0-.5-.1-.7-.1-1.3 0-2.4 1.1-2.4 2.4s1.1 2.4 2.4 2.4 2.4-1.1 2.4-2.4v-9.2h2.1c.1 1.2 1.1 2.2 2.3 2.3z"
                  fill="#25F4EE"
                  fillOpacity={0.7}
                />
                <path
                  d="M27.5 17.2v2.2c-1.2 0-2.3-.3-3.3-.9v5.1c0 2.5-2 4.5-4.5 4.5s-4.5-2-4.5-4.5 2-4.5 4.5-4.5c.2 0 .5 0 .7.1v2.1c-.2 0-.5-.1-.7-.1-1.3 0-2.4 1.1-2.4 2.4s1.1 2.4 2.4 2.4 2.4-1.1 2.4-2.4v-9.2h2.1c.1 1.2 1.1 2.2 2.3 2.3z"
                  fill="#FE2C55"
                  fillOpacity={0.4}
                />
              </svg>
            </a>
            <a
              href="https://www.instagram.com/yael_vicente27?igsh=OW9qMzA3NWVudW92&utm_source=qr"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="hover:scale-110 transition-transform"
            >
              <svg width={50} height={50} viewBox="0 0 40 40" fill="none">
                <circle cx="20" cy="20" r="20" fill="url(#ig-gradient)" />
                <defs>
                  <radialGradient id="ig-gradient" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#fdf497" />
                    <stop offset="40%" stopColor="#fdf497" />
                    <stop offset="60%" stopColor="#fd5949" />
                    <stop offset="80%" stopColor="#d6249f" />
                    <stop offset="100%" stopColor="#285AEB" />
                  </radialGradient>
                </defs>
                <rect
                  x="12"
                  y="12"
                  width="16"
                  height="16"
                  rx="5"
                  fill="none"
                  stroke="#fff"
                  strokeWidth="2"
                />
                <circle
                  cx="20"
                  cy="20"
                  r="4"
                  fill="none"
                  stroke="#fff"
                  strokeWidth="2"
                />
                <circle
                  cx="25.5"
                  cy="14.5"
                  r="1"
                  fill="#fff"
                />
              </svg>
            </a>
            </div>
            </div>
          </div>

          <Card className="shadow-xl border border-slate-200 bg-white">
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
                    <label className="text-sm font-medium text-slate-800">Nombre completo *</label>
                    <Input name="nombre" placeholder="Tu nombre" required />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-slate-800">Correo electrónico *</label>
                      <Input type="email" name="email" placeholder="tucorreo@email.com" required />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-800">WhatsApp</label>
                      <Input name="whatsapp" placeholder="+52 55..." />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-slate-800">Ocupación</label>
                      <Input name="ocupacion" placeholder="Prepa / Uni / Profesional" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-800">Experiencia en programación</label>
                      <Input name="experiencia" placeholder="Ninguna / Básica / Intermedia" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-800">¿Por qué quieres tomar el curso?</label>
                    <Textarea name="motivo" placeholder="Cuéntanos en 1-2 líneas" rows={3} />
                  </div>
                  <div className="flex items-start gap-2 text-sm text-slate-700">
                    <input type="checkbox" name="consent" required className="mt-1" />
                    <p>Acepto ser contactad@ para completar mi inscripción. <span className="underline">Aviso de privacidad</span>.</p>
                  </div>

                  {/* Honeypot oculto (antispam) */}
                  <div className="hidden" aria-hidden="true">
                    <label>Deja este campo vacío</label>
                    <input name="_hpt" tabIndex={-1} autoComplete="off" />
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
      <section className="relative max-w-7xl mx-auto px-4 pb-20">
        <h2 className="text-3xl font-bold text-slate-900">Preguntas frecuentes</h2>
        <div className="mt-6 grid md:grid-cols-2 gap-6 text-sm text-slate-700">
          <Faq q="¿Necesito experiencia previa?" a="No. Empezamos desde cero y usamos IA para apoyarte en cada paso." />
          <Faq q="¿Las clases quedan grabadas?" a="Sí, tendrás acceso a las grabaciones durante el curso para repaso." />
          <Faq q="¿Qué herramientas usaremos?" a="Principalmente VS Code, Python y ChatGPT u otras IA equivalentes." />
          <Faq q="¿Entregarán certificado?" a="Sí, al completar el 80% del curso y el mini proyecto final." />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200/70 bg-white/80 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 py-10 text-sm text-slate-600 grid md:grid-cols-2 gap-6 items-center">
          <p>© {new Date().getFullYear()} Yael Vicente · Todos los derechos reservados</p>
          <div className="flex md:justify-end gap-4">
            <a className="hover:text-slate-900" href="#">Aviso de privacidad</a>
            <a className="hover:text-slate-900" href={`https://wa.me/${CONFIG.WHATSAPP_NUMBER.replace(/[^\d]/g, "")}`} target="_blank" rel="noreferrer">WhatsApp</a>
            <a className="hover:text-slate-900" href={`mailto:${CONFIG.FALLBACK_EMAIL}`}>Contacto</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ---------- Subcomponentes UI ---------- */
function LineItem({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-2">
      <Check className="h-4 w-4 mt-0.5 text-indigo-600" />
      <span className="text-sm text-slate-700">{text}</span>
    </div>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2 text-slate-700">
      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-indigo-600"></span>
      <span>{children}</span>
    </div>
  );
}

function Faq({ q, a }: { q: string; a: string }) {
  return (
    <Card className="bg-white border border-slate-200">
      <CardHeader>
        <CardTitle className="text-base text-slate-900">{q}</CardTitle>
      </CardHeader>
      <CardContent className="text-slate-700">{a}</CardContent>
    </Card>
  );
}

function Badge({ icon, children }: { icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-200 text-indigo-800 rounded-full px-3 py-1">
      {icon} {children}
    </span>
  );
}


/* Acordeón nativo (details/summary) para el temario detallado */
function Accordion({ title, items }: { title: string; items: string[] }) {
  return (
    <details className="group bg-white border border-slate-200 rounded-xl">
      <summary className="cursor-pointer list-none select-none p-4 flex items-center justify-between">
        <span className="font-semibold text-slate-900">{title}</span>
        <span className="ml-4 text-indigo-600 group-open:rotate-90 transition">›</span>
      </summary>
      <div className="px-4 pb-4">
        <ul className="text-sm text-slate-700 space-y-2">
          {items.map((it) => (
            <li key={it} className="flex gap-2">
              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-indigo-600" />
              <span>{it}</span>
            </li>
          ))}
        </ul>
      </div>
    </details>
  );
}

/* Fondo visual suave */
function LightGradientBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10">
      <div className="absolute -top-40 -left-40 h-80 w-80 bg-gradient-to-br from-indigo-300/40 via-purple-300/40 to-cyan-300/40 blur-3xl rounded-full" />
      <div className="absolute top-40 -right-32 h-80 w-80 bg-gradient-to-br from-cyan-300/40 via-sky-300/40 to-indigo-300/40 blur-3xl rounded-full" />
    </div>
  );
}
