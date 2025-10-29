import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Card, Text, Modal, Icon } from '@ui-kitten/components';
import dayjs from 'dayjs';
import { Run } from '../types';
import { Spinner } from './Spinner';

// Tipos de presets disponibles
export type ModalPreset = 'delete' | 'loader' | 'success' | 'error' | 'confirmation';

// Props base del modal
interface BaseModalProps {
  visible: boolean;
  onBackdropPress?: () => void;
  preset: ModalPreset;
}

// Props específicas para delete confirmation
interface DeleteConfirmationProps extends BaseModalProps {
  preset: 'delete';
  runToDelete: Run | null;
  onConfirm: () => void;
  onCancel: () => void;
  formatDuration: (seconds: number) => string;
}

// Props específicas para loader
interface LoaderProps extends BaseModalProps {
  preset: 'loader';
  message?: string;
}

// Props específicas para success
interface SuccessProps extends BaseModalProps {
  preset: 'success';
  title?: string;
  message: string;
  onConfirm?: () => void;
  confirmText?: string;
}

// Props específicas para error
interface ErrorProps extends BaseModalProps {
  preset: 'error';
  title?: string;
  message: string;
  onConfirm?: () => void;
  confirmText?: string;
}

// Props específicas para confirmation genérica
interface ConfirmationProps extends BaseModalProps {
  preset: 'confirmation';
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  confirmStatus?: 'primary' | 'success' | 'info' | 'warning' | 'danger';
}

// Union type de todas las props
export type GenericModalProps = 
  | DeleteConfirmationProps 
  | LoaderProps 
  | SuccessProps 
  | ErrorProps 
  | ConfirmationProps;

export const GenericModal: React.FC<GenericModalProps> = (props) => {
  const { visible, onBackdropPress, preset } = props;

  const renderContent = () => {
    switch (preset) {
      case 'delete':
        const deleteProps = props as DeleteConfirmationProps;
        return (
          <>
            <Text category="h6" style={styles.modalTitle}>
              Confirmar eliminación
            </Text>
            <Text category="s1" style={styles.modalText}>
              ¿Estás seguro de que quieres eliminar esta sesión de running?
            </Text>
            {deleteProps.runToDelete && (
              <Text category="s2" style={styles.modalRunInfo}>
                {dayjs(deleteProps.runToDelete.startTime).format('DD/MM/YYYY HH:mm')} - {deleteProps.formatDuration(deleteProps.runToDelete.duration)}
              </Text>
            )}
            <View style={styles.modalButtons}>
              <Button
                style={styles.modalButton}
                appearance="ghost"
                onPress={deleteProps.onCancel}
              >
                Cancelar
              </Button>
              <Button
                style={styles.modalButton}
                status="danger"
                onPress={deleteProps.onConfirm}
              >
                Eliminar
              </Button>
            </View>
          </>
        );

      case 'loader':
        const loaderProps = props as LoaderProps;
        return (
          <View style={styles.loaderContent}>
            <Spinner size="large" />
            <Text category="s1" style={styles.loaderText}>
              {loaderProps.message || 'Cargando...'}
            </Text>
          </View>
        );

      case 'success':
        const successProps = props as SuccessProps;
        return (
          <>
            <View style={styles.iconContainer}>
              <Icon
                name="checkmark-circle-2"
                fill="#00E096"
                style={styles.statusIcon}
              />
            </View>
            <Text category="h6" style={styles.modalTitle}>
              {successProps.title || '¡Éxito!'}
            </Text>
            <Text category="s1" style={styles.modalText}>
              {successProps.message}
            </Text>
            {successProps.onConfirm && (
              <Button
                style={styles.singleButton}
                status="success"
                onPress={successProps.onConfirm}
              >
                {successProps.confirmText || 'Aceptar'}
              </Button>
            )}
          </>
        );

      case 'error':
        const errorProps = props as ErrorProps;
        return (
          <>
            <View style={styles.iconContainer}>
              <Icon
                name="alert-circle"
                fill="#FF3D71"
                style={styles.statusIcon}
              />
            </View>
            <Text category="h6" style={styles.modalTitle}>
              {errorProps.title || 'Error'}
            </Text>
            <Text category="s1" style={styles.modalText}>
              {errorProps.message}
            </Text>
            {errorProps.onConfirm && (
              <Button
                style={styles.singleButton}
                status="danger"
                onPress={errorProps.onConfirm}
              >
                {errorProps.confirmText || 'Aceptar'}
              </Button>
            )}
          </>
        );

      case 'confirmation':
        const confirmProps = props as ConfirmationProps;
        return (
          <>
            <Text category="h6" style={styles.modalTitle}>
              {confirmProps.title}
            </Text>
            <Text category="s1" style={styles.modalText}>
              {confirmProps.message}
            </Text>
            <View style={styles.modalButtons}>
              <Button
                style={styles.modalButton}
                appearance="ghost"
                onPress={confirmProps.onCancel}
              >
                {confirmProps.cancelText || 'Cancelar'}
              </Button>
              <Button
                style={styles.modalButton}
                status={confirmProps.confirmStatus || 'primary'}
                onPress={confirmProps.onConfirm}
              >
                {confirmProps.confirmText || 'Confirmar'}
              </Button>
            </View>
          </>
        );

      default:
        return null;
    }
  };

  // No mostrar backdrop para loader
  const shouldShowBackdrop = preset !== 'loader';

  return (
    <Modal
      visible={visible}
      backdropStyle={shouldShowBackdrop ? styles.backdrop : styles.transparentBackdrop}
      onBackdropPress={shouldShowBackdrop ? onBackdropPress : undefined}
    >
      <Card disabled={true} style={styles.modal}>
        {renderContent()}
      </Card>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  transparentBackdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modal: {
    margin: 20,
    padding: 20,
  },
  modalTitle: {
    marginBottom: 16,
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 12,
    textAlign: 'center',
  },
  modalRunInfo: {
    marginBottom: 20,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 8,
  },
  singleButton: {
    marginTop: 8,
  },
  loaderContent: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  loaderText: {
    marginTop: 16,
    textAlign: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  statusIcon: {
    width: 48,
    height: 48,
  },
});