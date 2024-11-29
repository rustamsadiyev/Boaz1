import { Controller, UseFormReturn, Path } from "react-hook-form";
import { z } from "zod";
import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import ErrorMessage from "../ui/error-message";

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

interface ImagePickerProps<IForm extends Record<string, any>> {
  name: Path<IForm>;
  label?: string;
  disabled?: boolean;
  methods: UseFormReturn<IForm>;
  hideError?: boolean;
  className?: string;
}

export default function FormImageDrop<IForm extends Record<string, any>>({
  name,
  label,
  disabled,
  methods,
  hideError = false,
  className,
}: ImagePickerProps<IForm>) {
  const {
    control,
    formState: { errors },
  } = methods;

  const [isDragging, setIsDragging] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string>("");

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent, onChange: (value: any) => void) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      onChange(file);
      setSelectedFileName(file.name);
    }
  };

  return (
    <div className={cn("w-full flex flex-col items-center", className)}>
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value, ...field } }) => (
          <div className="w-full">
            <div className="grid w-full items-center gap-4">
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor={name}
                  className={cn(
                    "flex flex-col items-center justify-center w-full h-20 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 dark:hover:bg-gray-800 dark:bg-gray-700 border-gray-300 dark:border-gray-600 dark:hover:border-gray-500",
                    isDragging && "border-primary",
                    errors?.[name] && "border-destructive"
                  )}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, onChange)}
                >
                  <div className="flex flex-col items-center justify-center pt-2 pb-2">
                    <ImageIcon className="w-6 h-6 mb-1 text-gray-500 dark:text-gray-400" />
                    {selectedFileName ? (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Tanlangan: {selectedFileName}
                      </p>
                    ) : (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-semibold">
                          Tanlash uchun bosing
                        </span>{" "}
                        yoki kursor bilan qo'ying
                      </p>
                    )}
                  </div>
                  <input
                    id={name}
                    type="file"
                    accept={ACCEPTED_IMAGE_TYPES.join(",")}
                    className="hidden"
                    disabled={disabled}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        onChange(file);
                        setSelectedFileName(file.name);
                      }
                    }}
                    {...field}
                  />
                </label>
              </div>
            </div>
          </div>
        )}
      />
      {!hideError && errors?.[name] && (
        <ErrorMessage>{errors[name]?.message as string}</ErrorMessage>
      )}
    </div>
  );
}
