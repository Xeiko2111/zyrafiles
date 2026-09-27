import { PageHeader } from "../components/layout/PageHeader";
import { UploadForm } from "../components/uploads/UploadForm";

export default function UploadPage() {
  return (
    <div>
      <PageHeader eyebrow="Subir contenido" title="Nueva subida" subtitle="Se guardará con tu nombre y la fecha y hora de publicación." />
      <UploadForm />
    </div>
  );
}
