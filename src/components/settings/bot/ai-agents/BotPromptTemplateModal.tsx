'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Save, RotateCcw, Loader2, Check, X, ChevronDown, ChevronUp, Info } from 'lucide-react';
import { botTemplateService, TemplateVariable } from '@/services/bot-template.service';
import { SETTING_KEYS } from '@/services/settings.service';
import { getSettingsAction, updateSettingsAction } from '@/actions/settings.actions';

interface BotPromptTemplateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BotPromptTemplateModal({ open, onOpenChange }: BotPromptTemplateModalProps) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [validating, setValidating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [template, setTemplate] = useState('');
  const [defaultTemplate, setDefaultTemplate] = useState('');
  const [isCustom, setIsCustom] = useState(false);
  const [availableVariables, setAvailableVariables] = useState<TemplateVariable[]>([]);
  const [validationResult, setValidationResult] = useState<{ valid: boolean; error?: string } | null>(null);
  const [showVariables, setShowVariables] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>([]);

  useEffect(() => {
    if (open) {
      loadTemplate();
    }
  }, [open]);

  const loadTemplate = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get default template
      const defaultData = await botTemplateService.getDefaultTemplate();
      setDefaultTemplate(defaultData.template);
      setAvailableVariables(defaultData.available_variables);

      // Get current template from settings
      const settings = await getSettingsAction();
      const customTemplate = settings[SETTING_KEYS.AI_BOT_PROMPT_TEMPLATE] || '';

      if (customTemplate) {
        setTemplate(customTemplate);
        setIsCustom(true);
      } else {
        setTemplate(defaultData.template);
        setIsCustom(false);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load template');
    } finally {
      setLoading(false);
    }
  };

  const handleValidate = async () => {
    try {
      setValidating(true);
      setValidationResult(null);
      const result = await botTemplateService.validateTemplate(template);
      setValidationResult(result);
    } catch (err: any) {
      setValidationResult({ valid: false, error: err.message });
    } finally {
      setValidating(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(false);

      // Validate first
      const result = await botTemplateService.validateTemplate(template);
      if (!result.valid) {
        setError('Template validation failed: ' + (result.error || 'Unknown error'));
        return;
      }

      // Save only if different from default
      const templateToSave = template === defaultTemplate ? '' : template;

      await updateSettingsAction({
        [SETTING_KEYS.AI_BOT_PROMPT_TEMPLATE]: templateToSave,
      });

      setIsCustom(templateToSave !== '');
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to save template');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setTemplate(defaultTemplate);
    setValidationResult(null);
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const variableGroups = {
    identity: {
      title: 'Identity Variables',
      variables: availableVariables.filter(v =>
        ['BotName', 'ProjectName', 'AgentName', 'GreetingMessage'].includes(v.name)
      )
    },
    behavior: {
      title: 'Behavior Flags (boolean)',
      variables: availableVariables.filter(v => v.type === 'bool')
    },
    personality: {
      title: 'Tone & Personality',
      variables: availableVariables.filter(v =>
        ['Tone', 'ToneDescription', 'HumorLevel', 'FormalityLevel', 'PersonalityDescription'].includes(v.name)
      )
    },
    limits: {
      title: 'Limits & Restrictions',
      variables: availableVariables.filter(v =>
        ['MaxResponseLength', 'MaxResponseWords', 'MaxToolCalls', 'ContextWindow', 'BlockedTopics', 'CollectUserInfoFields'].includes(v.name)
      )
    },
    content: {
      title: 'Content',
      variables: availableVariables.filter(v => ['Instructions', 'Rules'].includes(v.name))
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DialogTitle>Bot Prompt Template</DialogTitle>
              {isCustom && (
                <Badge variant="secondary" className="text-xs">Custom</Badge>
              )}
            </div>
          </div>
          <DialogDescription className="text-xs">
            Customize the system prompt template used for all AI agents. Uses{' '}
            <a
              href="https://github.com/CloudyKit/jet"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Jet template syntax
            </a>.
            Tool documentation is appended automatically and cannot be customized.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="flex-1 min-h-0 space-y-4">
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                {error}
              </div>
            )}

            {success && (
              <div className="p-3 text-sm text-green-600 bg-green-50 border border-green-200 rounded-md">
                Template saved successfully!
              </div>
            )}

            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowVariables(!showVariables)}
                className="text-xs"
              >
                <Info className="w-4 h-4 mr-1" />
                {showVariables ? 'Hide' : 'Show'} Variables Reference
              </Button>
            </div>

            {showVariables && (
              <ScrollArea className="h-48 border rounded-md p-3">
                <div className="space-y-2">
                  {Object.entries(variableGroups).map(([key, group]) => (
                    <div key={key} className="border rounded">
                      <button
                        onClick={() => toggleSection(key)}
                        className="w-full flex items-center justify-between p-2 text-left text-sm font-medium hover:bg-muted/50"
                      >
                        {group.title}
                        {expandedSections.includes(key) ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>
                      {expandedSections.includes(key) && (
                        <div className="p-2 pt-0 space-y-1">
                          {group.variables.map((variable) => (
                            <div key={variable.name} className="flex justify-between items-start p-1.5 bg-muted rounded text-xs">
                              <div>
                                <code className="font-mono text-primary">
                                  {variable.type === 'bool'
                                    ? `{{if ${variable.name}}}...{{end}}`
                                    : `{{${variable.name}}}`
                                  }
                                </code>
                                <p className="text-muted-foreground mt-0.5">{variable.description}</p>
                              </div>
                              <Badge variant="outline" className="text-xs ml-2">{variable.type}</Badge>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}

            <Textarea
              value={template}
              onChange={(e) => {
                setTemplate(e.target.value);
                setValidationResult(null);
              }}
              placeholder="Enter your custom template..."
              className="font-mono text-xs min-h-[300px] flex-1"
            />

            {validationResult && (
              <div
                className={`flex items-center gap-2 text-sm ${
                  validationResult.valid ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {validationResult.valid ? (
                  <>
                    <Check className="w-4 h-4" />
                    Template is valid
                  </>
                ) : (
                  <>
                    <X className="w-4 h-4" />
                    {validationResult.error}
                  </>
                )}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-2 justify-between pt-4 border-t">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={handleReset}
                  disabled={template === defaultTemplate}
                  size="sm"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset to Default
                </Button>
                <Button
                  variant="outline"
                  onClick={handleValidate}
                  disabled={validating}
                  size="sm"
                >
                  {validating ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Check className="w-4 h-4 mr-2" />
                  )}
                  Validate
                </Button>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => onOpenChange(false)} size="sm">
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={saving} size="sm">
                  {saving ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  {saving ? 'Saving...' : 'Save Template'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
