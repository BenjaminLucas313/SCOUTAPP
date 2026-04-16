/**
 * Componentes UI base.
 * Wrappean los primitivos de React Native con clases NativeWind predefinidas.
 * El resto de la app importa de acá, no de 'react-native' directamente.
 */

import React from 'react';
import {
  Text as RNText,
  View as RNView,
  TouchableOpacity,
  ActivityIndicator,
  type TextProps,
  type ViewProps,
  type TouchableOpacityProps,
} from 'react-native';

// ─── Text variants ────────────────────────────────────────────────────────────

type TextVariant = 'h1' | 'h2' | 'h3' | 'body' | 'label' | 'caption' | 'muted';

const TEXT_CLASSES: Record<TextVariant, string> = {
  h1:      'text-2xl font-bold text-white',
  h2:      'text-xl font-semibold text-white',
  h3:      'text-base font-semibold text-white',
  body:    'text-sm text-gray-200',
  label:   'text-xs font-medium text-gray-400 uppercase tracking-wider',
  caption: 'text-xs text-gray-500',
  muted:   'text-sm text-gray-500',
};

interface AppTextProps extends TextProps {
  variant?: TextVariant;
}

export function Text({ variant = 'body', className = '', ...props }: AppTextProps) {
  return (
    <RNText
      className={`${TEXT_CLASSES[variant]} ${className}`}
      {...props}
    />
  );
}

// ─── Card ─────────────────────────────────────────────────────────────────────

export function Card({ className = '', ...props }: ViewProps) {
  return (
    <RNView
      className={`bg-surface-1 rounded-xl border border-white/5 ${className}`}
      {...props}
    />
  );
}

// ─── Button ───────────────────────────────────────────────────────────────────

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize    = 'sm' | 'md' | 'lg';

const BUTTON_VARIANTS: Record<ButtonVariant, string> = {
  primary:   'bg-brand-500 active:bg-brand-600',
  secondary: 'bg-surface-2 active:bg-surface-3 border border-white/10',
  ghost:     'bg-transparent active:bg-white/5',
  danger:    'bg-red-600/20 active:bg-red-600/30 border border-red-500/30',
};

const BUTTON_TEXT: Record<ButtonVariant, string> = {
  primary:   'text-white font-semibold',
  secondary: 'text-gray-200 font-medium',
  ghost:     'text-gray-400 font-medium',
  danger:    'text-red-400 font-medium',
};

const BUTTON_SIZES: Record<ButtonSize, string> = {
  sm:  'px-3 py-1.5 rounded-lg',
  md:  'px-4 py-2.5 rounded-xl',
  lg:  'px-6 py-3.5 rounded-xl',
};

const BUTTON_TEXT_SIZES: Record<ButtonSize, string> = {
  sm:  'text-xs',
  md:  'text-sm',
  lg:  'text-base',
};

interface ButtonProps extends TouchableOpacityProps {
  variant?:  ButtonVariant;
  size?:     ButtonSize;
  loading?:  boolean;
  label:     string;
  leftIcon?: React.ReactNode;
}

export function Button({
  variant  = 'primary',
  size     = 'md',
  loading  = false,
  label,
  leftIcon,
  disabled,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <TouchableOpacity
      className={`
        flex-row items-center justify-center gap-2
        ${BUTTON_VARIANTS[variant]}
        ${BUTTON_SIZES[size]}
        ${disabled || loading ? 'opacity-50' : ''}
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <ActivityIndicator size="small" color="#fff" />
      ) : (
        leftIcon
      )}
      <RNText className={`${BUTTON_TEXT[variant]} ${BUTTON_TEXT_SIZES[size]}`}>
        {label}
      </RNText>
    </TouchableOpacity>
  );
}

// ─── Badge ────────────────────────────────────────────────────────────────────

type BadgeColor = 'blue' | 'green' | 'yellow' | 'red' | 'gray' | 'purple';

const BADGE_COLORS: Record<BadgeColor, string> = {
  blue:   'bg-blue-500/20 border-blue-500/30',
  green:  'bg-green-500/20 border-green-500/30',
  yellow: 'bg-yellow-500/20 border-yellow-500/30',
  red:    'bg-red-500/20 border-red-500/30',
  gray:   'bg-white/5 border-white/10',
  purple: 'bg-purple-500/20 border-purple-500/30',
};

const BADGE_TEXT_COLORS: Record<BadgeColor, string> = {
  blue:   'text-blue-400',
  green:  'text-green-400',
  yellow: 'text-yellow-400',
  red:    'text-red-400',
  gray:   'text-gray-400',
  purple: 'text-purple-400',
};

interface BadgeProps {
  label:    string;
  color?:   BadgeColor;
  className?: string;
}

export function Badge({ label, color = 'gray', className = '' }: BadgeProps) {
  return (
    <RNView
      className={`
        px-2 py-0.5 rounded-full border self-start
        ${BADGE_COLORS[color]} ${className}
      `}
    >
      <RNText className={`text-xs font-medium ${BADGE_TEXT_COLORS[color]}`}>
        {label}
      </RNText>
    </RNView>
  );
}

// ─── Divider ──────────────────────────────────────────────────────────────────

export function Divider({ className = '' }: { className?: string }) {
  return <RNView className={`h-px bg-white/5 ${className}`} />;
}

// ─── Screen wrapper ───────────────────────────────────────────────────────────

export function ScreenContainer({ className = '', ...props }: ViewProps) {
  return (
    <RNView className={`flex-1 bg-surface-0 ${className}`} {...props} />
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

interface EmptyStateProps {
  title:    string;
  subtitle?: string;
  action?:  React.ReactNode;
}

export function EmptyState({ title, subtitle, action }: EmptyStateProps) {
  return (
    <RNView className="flex-1 items-center justify-center gap-3 px-8 py-16">
      <Text variant="h3" className="text-center text-gray-500">{title}</Text>
      {subtitle && (
        <Text variant="muted" className="text-center">{subtitle}</Text>
      )}
      {action}
    </RNView>
  );
}
