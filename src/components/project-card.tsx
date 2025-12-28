"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import Markdown from "react-markdown";
import { ImageSlideshow } from "./image-slideshow";
import { X } from "lucide-react";

interface Props {
  title: string;
  href?: string;
  description: string;
  dates: string;
  tags: readonly string[];
  link?: string;
  image?: string;
  video?: string;
  images?: readonly string[];
  links?: readonly {
    icon: React.ReactNode;
    type: string;
    href: string;
  }[];
  className?: string;
}

export function ProjectCard({
  title,
  href,
  description,
  dates,
  tags,
  link,
  image,
  video,
  images,
  links,
  className,
}: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const isPlastyAI = title === "PlastyAI - Microplastic Tracker";

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (isModalOpen) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "unset";
      }
      return () => {
        document.body.style.overflow = "unset";
      };
    }
  }, [isModalOpen]);

  return (
    <>
      <Card
        className={cn(
          "flex flex-col overflow-hidden border hover:shadow-lg transition-all duration-300 ease-out h-full",
          isPlastyAI && images && images.length > 0 && "cursor-pointer"
        )}
        onClick={() => {
          if (isPlastyAI && images && images.length > 0) {
            setIsModalOpen(true);
          }
        }}
      >
        {images && images.length > 0 ? (
          <div onClick={(e) => e.preventDefault()}>
            <ImageSlideshow images={images} alt={title} />
          </div>
        ) : (
          <Link
            href={href || "#"}
            className={cn("block cursor-pointer", className)}
          >
            {video ? (
              <video
                src={video}
                autoPlay
                loop
                muted
                playsInline
                className="pointer-events-none mx-auto h-40 w-full object-cover object-top" // needed because random black line at bottom of video
              />
            ) : image ? (
              <Image
                src={image}
                alt={title}
                width={500}
                height={300}
                className="h-40 w-full overflow-hidden object-cover object-top"
              />
            ) : null}
          </Link>
        )}
      <CardHeader className="px-2">
        <div className="space-y-1">
          <CardTitle className="mt-1 text-base">{title}</CardTitle>
          <time className="font-sans text-xs">{dates}</time>
          <div className="hidden font-sans text-xs underline print:visible">
            {link?.replace("https://", "").replace("www.", "").replace("/", "")}
          </div>
          <Markdown className="prose max-w-full text-pretty font-sans text-xs text-muted-foreground dark:prose-invert">
            {description}
          </Markdown>
        </div>
      </CardHeader>
      <CardContent className="mt-auto flex flex-col px-2">
        {tags && tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {tags?.map((tag) => (
              <Badge
                className="px-1 py-0 text-[10px]"
                variant="secondary"
                key={tag}
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="px-2 pb-2">
        {links && links.length > 0 && (
          <div className="flex flex-row flex-wrap items-start gap-1">
            {links?.map((link, idx) => (
              <Link href={link?.href} key={idx} target="_blank">
                <Badge key={idx} className="flex gap-2 px-2 py-1 text-[10px]">
                  {link.icon}
                  {link.type}
                </Badge>
              </Link>
            ))}
          </div>
        )}
      </CardFooter>
    </Card>

    {/* Modal for PlastyAI */}
    {mounted && isModalOpen && isPlastyAI && images && images.length > 0 && createPortal(
      <div
        className="fixed inset-0 flex items-center justify-center"
        style={{ 
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 99999,
          margin: 0,
          padding: 0
        }}
        onClick={() => setIsModalOpen(false)}
      >
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          style={{ 
            position: "absolute",
            zIndex: 99998
          }}
        />
        
        {/* Modal Content */}
        <div
          className="bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col"
          style={{ 
            width: "75vw", 
            height: "75vh",
            minWidth: "75vw",
            minHeight: "75vh",
            maxWidth: "75vw",
            maxHeight: "75vh",
            zIndex: 99999,
            position: "relative",
            margin: "auto"
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-2xl font-bold">{title}</h2>
            <button
              onClick={() => setIsModalOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Slideshow Content */}
          <div className="flex-1 overflow-auto p-6">
            <div className="w-full" style={{ height: "calc(75vh - 200px)" }}>
              <div className="h-full w-full">
                <ImageSlideshow images={images} alt={title} className="h-full w-full" />
              </div>
            </div>
            <div className="mt-6">
              <Markdown className="prose max-w-full text-pretty font-sans text-sm text-muted-foreground">
                {description}
              </Markdown>
              {tags && tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Badge
                      className="px-2 py-1 text-xs"
                      variant="secondary"
                      key={tag}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>,
      document.body
    )}
    </>
  );
}
