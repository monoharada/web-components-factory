/**
 * web-components.ts の PropertyAttr を拡張したバリデーション付き属性クラス
 */

import { PropertyAttr } from '../web-components';

export interface PropertyAttrOptions<T = unknown> {
  validate?: (value: T) => boolean;
  default?: T;
  transform?: (value: string) => T;
  serialize?: (value: T) => string;
}

/**
 * バリデーションとデフォルト値をサポートする拡張PropertyAttr
 */
export class ValidatedPropertyAttr<T = unknown> extends PropertyAttr {
  #validator?: (value: T) => boolean;
  #defaultValue?: T;
  #transform?: (value: string) => T;
  #serialize?: (value: T) => string;
  #errorHandler?: (error: Error, value: unknown) => void;
  
  constructor(
    property: string,
    options?: PropertyAttrOptions<T>
  ) {
    super(property);
    this.#validator = options?.validate;
    this.#defaultValue = options?.default;
    this.#transform = options?.transform;
    this.#serialize = options?.serialize;
  }
  
  /**
   * エラーハンドラーの設定
   */
  setErrorHandler(handler: (error: Error, value: unknown) => void) {
    this.#errorHandler = handler;
  }
  
  /**
   * 値の設定（バリデーション付き）
   */
  setValue(element: HTMLElement, value: unknown): void {
    try {
      // デフォルト値の適用
      const actualValue = value ?? this.#defaultValue;
      
      // 変換処理
      let processedValue = actualValue;
      if (typeof actualValue === 'string' && this.#transform) {
        processedValue = this.#transform(actualValue);
      }
      
      // バリデーション
      if (this.#validator && !this.#validator(processedValue as T)) {
        const error = new Error(
          `無効な値: ${this.property}="${actualValue}"`
        );
        
        if (this.#errorHandler) {
          this.#errorHandler(error, actualValue);
        } else {
          console.warn(error.message);
        }
        
        // デフォルト値にフォールバック
        if (this.#defaultValue !== undefined) {
          super.setValue(element, this.#serialize ? 
            this.#serialize(this.#defaultValue) : 
            this.#defaultValue
          );
        }
        return;
      }
      
      // 値を設定
      const finalValue = this.#serialize ? 
        this.#serialize(processedValue as T) : 
        processedValue;
      
      super.setValue(element, finalValue);
      
    } catch (error) {
      if (this.#errorHandler) {
        this.#errorHandler(error as Error, value);
      } else {
        console.error(`属性設定エラー: ${this.property}`, error);
      }
      
      // エラー時はデフォルト値を使用
      if (this.#defaultValue !== undefined) {
        super.setValue(element, this.#defaultValue);
      }
    }
  }
  
  /**
   * 値の取得
   */
  getValue(element: HTMLElement): T | undefined {
    const value = super.getValue(element);
    
    if (value === undefined || value === null) {
      return this.#defaultValue;
    }
    
    if (typeof value === 'string' && this.#transform) {
      return this.#transform(value);
    }
    
    return value as T;
  }
}

/**
 * プリセットバリデーター
 */
export class Validators {
  static readonly string = (v: unknown): v is string => 
    typeof v === 'string';
  
  static readonly number = (v: unknown): v is number => 
    typeof v === 'number' && !isNaN(v);
  
  static readonly boolean = (v: unknown): v is boolean => 
    typeof v === 'boolean';
  
  static readonly enum = <T extends string>(...values: T[]) => 
    (v: unknown): v is T => 
      typeof v === 'string' && values.includes(v as T);
  
  static readonly range = (min: number, max: number) => 
    (v: unknown): v is number => 
      typeof v === 'number' && v >= min && v <= max;
  
  static readonly pattern = (regex: RegExp) => 
    (v: unknown): v is string => 
      typeof v === 'string' && regex.test(v);
  
  static readonly minLength = (min: number) => 
    (v: unknown): v is string => 
      typeof v === 'string' && v.length >= min;
  
  static readonly maxLength = (max: number) => 
    (v: unknown): v is string => 
      typeof v === 'string' && v.length <= max;
}

/**
 * アニメーション属性用の特殊化
 */
export class AnimationPropertyAttr extends ValidatedPropertyAttr<string> {
  constructor() {
    super('animation', {
      validate: Validators.enum('none', 'smooth', 'bounce', 'custom'),
      default: 'none', // アクセシビリティファースト
      transform: (value: string) => {
        // prefers-reduced-motionチェック
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          return 'none';
        }
        return value;
      }
    });
  }
}

/**
 * 段階的エラーリカバリー
 */
export class ErrorRecovery {
  static readonly levels = {
    animation: 1,
    interaction: 2,
    critical: 3
  };
  
  static classifyError(error: Error): keyof typeof ErrorRecovery.levels {
    const message = error.message.toLowerCase();
    
    if (message.includes('animation') || message.includes('transition')) {
      return 'animation';
    }
    
    if (message.includes('keyboard') || message.includes('focus') || 
        message.includes('interaction')) {
      return 'interaction';
    }
    
    return 'critical';
  }
  
  static async recover(
    error: Error,
    component: HTMLElement,
    options?: {
      reportError?: (error: Error) => void;
      fallbackMode?: () => void;
    }
  ): Promise<void> {
    const level = this.classifyError(error);
    
    console.warn(`エラーリカバリー開始 (レベル: ${level})`, error);
    
    switch (level) {
      case 'animation':
        // アニメーションを無効化
        component.setAttribute('animation', 'none');
        console.info('アニメーション機能を無効化しました');
        break;
        
      case 'interaction':
        // インタラクション機能を制限
        component.setAttribute('keyboard-nav', 'false');
        component.querySelectorAll('[tabindex]').forEach(el => {
          el.setAttribute('tabindex', '-1');
        });
        console.warn('インタラクション機能を制限しました');
        break;
        
      case 'critical':
        // 最小限モードへフォールバック
        if (options?.fallbackMode) {
          options.fallbackMode();
        } else {
          component.setAttribute('data-fallback', 'true');
          component.setAttribute('animation', 'none');
          component.setAttribute('keyboard-nav', 'false');
        }
        console.error('最小限モードで動作しています');
        
        // エラーレポート送信
        if (options?.reportError) {
          options.reportError(error);
        }
        break;
    }
  }
}