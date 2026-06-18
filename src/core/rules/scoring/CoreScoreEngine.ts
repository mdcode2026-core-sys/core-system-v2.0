// src/core/rules/scoring/CoreScoreEngine.ts
// CORE Score Formula: APS×0.28 + DRI×0.24 + RVS×0.20 + URI×0.15 + TSI×0.13

import { supabase } from '../../../infrastructure/supabase/client';

export interface ScoreIndicators {
  APS: number;
  DRI: number;
  RVS: number;
  URI: number;
  TSI: number;
  PQS: number;
}

export interface CoreScoreResult {
  backend: number;
  display: number;
  patientClass: PatientClass;
  raw: number;
  penalty: number;
}

export type PatientClass = 
  | 'low_priority' 
  | 'medium_priority' 
  | 'high_priority' 
  | 'qualified' 
  | 'hot_lead';

export class CoreScoreEngine {
  private weights = { APS: 0.28, DRI: 0.24, RVS: 0.20, URI: 0.15, TSI: 0.13 };

  constructor() { this.loadWeightsFromConfig(); }

  private async loadWeightsFromConfig() {
    const { data } = await supabase
      .from('core_rules_config')
      .select('rule_value')
      .eq('rule_key', 'weights')
      .is('tenant_id', null)
      .single();
    if (data?.rule_value) this.weights = { ...this.weights, ...data.rule_value };
  }

  compute(indicators: ScoreIndicators): CoreScoreResult {
    const raw = indicators.APS * this.weights.APS + indicators.DRI * this.weights.DRI +
      indicators.RVS * this.weights.RVS + indicators.URI * this.weights.URI + indicators.TSI * this.weights.TSI;
    let penalty = 0;
    if (indicators.PQS >= 700) penalty = indicators.PQS * 0.20;
    else if (indicators.PQS >= 400) penalty = indicators.PQS * 0.10;
    const backend = Math.max(0, Math.min(1000, Math.round(raw - penalty)));
    const display = Math.round((backend / 10) * 10) / 10;
    return { backend, display, patientClass: this.classifyPatient(display), raw, penalty };
  }

  classifyPatient(display: number): PatientClass {
    if (display >= 90) return 'hot_lead';
    if (display >= 80) return 'qualified';
    if (display >= 60) return 'high_priority';
    if (display >= 40) return 'medium_priority';
    return 'low_priority';
  }

  computeWeighted(historicalAvg: number, sessionScore: number, lastVisitDate: Date | null) {
    const monthsAbsent = lastVisitDate ? (Date.now() - lastVisitDate.getTime()) / (1000 * 60 * 60 * 24 * 30) : Infinity;
    if (monthsAbsent > 18) return { score: sessionScore, mode: 'first_time' as const };
    return { score: Math.round(historicalAvg * 0.60 + sessionScore * 0.40), mode: 'weighted_ltv' as const };
  }
}

export const coreScoreEngine = new CoreScoreEngine();
