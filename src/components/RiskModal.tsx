import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useProjectStore } from '@/store/projectStore';
import { Risk, RiskAppetite } from '@/types';

const riskSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(100),
  description: z.string().optional(),
  impactMin: z.coerce.number().min(0.01, 'Debe ser mayor o igual a 0.01'),
  impactMax: z.coerce.number().min(0.01, 'Debe ser mayor o igual a 0.01'),
  frequencyMin: z.coerce.number().min(0.01, 'Debe ser mayor o igual a 0.01'),
  frequencyMax: z.coerce.number().min(0.01, 'Debe ser mayor o igual a 0.01'),
  appetite: z.enum(['tolerable', 'aversion', 'intolerable']),
}).refine(data => data.impactMax > data.impactMin, {
  message: 'El impacto máximo debe ser mayor que el mínimo',
  path: ['impactMax'],
}).refine(data => data.frequencyMax >= data.frequencyMin, {
  message: 'La frecuencia máxima debe ser mayor o igual que la mínima',
  path: ['frequencyMax'],
});

type RiskFormData = z.infer<typeof riskSchema>;

interface RiskModalProps {
  open: boolean;
  onClose: () => void;
  riskToEdit?: Risk | null;
}

export function RiskModal({ open, onClose, riskToEdit }: RiskModalProps) {
  const addRisk = useProjectStore(state => state.addRisk);
  const updateRisk = useProjectStore(state => state.updateRisk);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RiskFormData>({
    resolver: zodResolver(riskSchema),
    defaultValues: {
      name: '',
      description: '',
      impactMin: 0.1,
      impactMax: 10,
      frequencyMin: 0.1,
      frequencyMax: 5,
      appetite: 'aversion' as RiskAppetite,
    },
  });

  // Actualizar el formulario cuando cambia el riesgo a editar
  useEffect(() => {
    if (riskToEdit) {
      reset({
        name: riskToEdit.name,
        description: riskToEdit.description || '',
        impactMin: riskToEdit.impact.min,
        impactMax: riskToEdit.impact.max,
        frequencyMin: riskToEdit.frequency.min,
        frequencyMax: riskToEdit.frequency.max,
        appetite: riskToEdit.appetite,
      });
    } else {
      reset({
        name: '',
        description: '',
        impactMin: 0.1,
        impactMax: 10,
        frequencyMin: 0.1,
        frequencyMax: 5,
        appetite: 'aversion' as RiskAppetite,
      });
    }
  }, [riskToEdit, reset]);

  const onSubmit = (data: RiskFormData) => {
    const appetiteColors = {
      tolerable: '#10B981',
      aversion: '#FB923C',
      intolerable: '#EF4444',
    };

    if (riskToEdit) {
      // Actualizar riesgo existente
      updateRisk(riskToEdit.id, {
        name: data.name,
        description: data.description,
        impact: {
          ...riskToEdit.impact,
          min: data.impactMin,
          max: data.impactMax,
        },
        frequency: {
          ...riskToEdit.frequency,
          min: data.frequencyMin,
          max: data.frequencyMax,
        },
        appetite: data.appetite,
        color: appetiteColors[data.appetite],
      });
    } else {
      // Crear nuevo riesgo
      addRisk({
        name: data.name,
        description: data.description,
        impact: {
          min: data.impactMin,
          max: data.impactMax,
          unit: 'M',
        },
        frequency: {
          min: data.frequencyMin,
          max: data.frequencyMax,
        },
        appetite: data.appetite,
        color: appetiteColors[data.appetite],
        displayLine: 'min-max',
      });
    }

    reset();
    onClose();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{riskToEdit ? 'Editar Riesgo' : 'Agregar Nuevo Riesgo'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Información Básica */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Nombre del Riesgo *</Label>
              <Input
                id="name"
                {...register('name')}
                placeholder="Ej: Reclamos laborales de terceros"
                className="mt-1"
              />
              {errors.name && (
                <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="description">Descripción (opcional)</Label>
              <textarea
                id="description"
                {...register('description')}
                placeholder="Descripción detallada del riesgo..."
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
            </div>
          </div>

          {/* Impacto Económico */}
          <div className="border-t pt-4">
            <h3 className="font-semibold mb-3">Impacto Económico (Millones)</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="impactMin">Impacto Mínimo *</Label>
                <Input
                  id="impactMin"
                  type="number"
                  step="0.01"
                  min="0.01"
                  {...register('impactMin')}
                  className="mt-1"
                  placeholder="Ej: 0.5"
                />
                {errors.impactMin && (
                  <p className="text-sm text-red-600 mt-1">{errors.impactMin.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="impactMax">Impacto Máximo *</Label>
                <Input
                  id="impactMax"
                  type="number"
                  step="0.01"
                  min="0.01"
                  {...register('impactMax')}
                  className="mt-1"
                  placeholder="Ej: 10"
                />
                {errors.impactMax && (
                  <p className="text-sm text-red-600 mt-1">{errors.impactMax.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Frecuencia Anual */}
          <div className="border-t pt-4">
            <h3 className="font-semibold mb-3">Frecuencia Anual (eventos/año)</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="frequencyMin">Frecuencia Mínima *</Label>
                <Input
                  id="frequencyMin"
                  type="number"
                  step="0.01"
                  min="0.01"
                  {...register('frequencyMin')}
                  className="mt-1"
                  placeholder="Ej: 0.5"
                />
                {errors.frequencyMin && (
                  <p className="text-sm text-red-600 mt-1">{errors.frequencyMin.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="frequencyMax">Frecuencia Máxima *</Label>
                <Input
                  id="frequencyMax"
                  type="number"
                  step="0.01"
                  min="0.01"
                  {...register('frequencyMax')}
                  className="mt-1"
                  placeholder="Ej: 5"
                />
                {errors.frequencyMax && (
                  <p className="text-sm text-red-600 mt-1">{errors.frequencyMax.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Apetito de Riesgo */}
          <div className="border-t pt-4">
            <h3 className="font-semibold mb-3">Apetito de Riesgo *</h3>
            <div className="flex gap-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  value="tolerable"
                  {...register('appetite')}
                  className="w-4 h-4"
                />
                <span className="inline-flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-green-600"></span>
                  Tolerante
                </span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  value="aversion"
                  {...register('appetite')}
                  className="w-4 h-4"
                />
                <span className="inline-flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-orange-500"></span>
                  Averso
                </span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  value="intolerable"
                  {...register('appetite')}
                  className="w-4 h-4"
                />
                <span className="inline-flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-red-600"></span>
                  Intolerante
                </span>
              </label>
            </div>
            {errors.appetite && (
              <p className="text-sm text-red-600 mt-1">{errors.appetite.message}</p>
            )}
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-3 border-t pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {riskToEdit ? 'Actualizar Riesgo' : 'Agregar Riesgo'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
