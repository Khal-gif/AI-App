/**
 * ESLint Plugin for Design System Compliance
 * Enforces 8pt grid, Mulish font, and shadcn/ui component usage
 */

module.exports = {
  rules: {
    // Prevent hardcoded spacing values that don't follow 8pt grid
    'no-arbitrary-spacing': {
      meta: {
        type: 'problem',
        docs: {
          description: 'Enforce 8pt grid system - all spacing must be divisible by 4px',
        },
        fixable: null,
        schema: [],
      },
      create(context) {
        return {
          Literal(node) {
            if (typeof node.value === 'string') {
              // Check for hardcoded pixel values
              const pxMatch = node.value.match(/(\d+)px/g)
              if (pxMatch) {
                pxMatch.forEach(match => {
                  const value = parseInt(match.replace('px', ''))
                  if (value % 4 !== 0) {
                    context.report({
                      node,
                      message: `Spacing "${match}" violates 8pt grid. Use values divisible by 4px.`,
                    })
                  }
                })
              }
            }
          },
        }
      },
    },

    // Enforce only allowed font weights
    'valid-font-weights': {
      meta: {
        type: 'problem',
        docs: {
          description: 'Enforce only allowed font weights: 400, 500, 600, 700',
        },
        fixable: null,
        schema: [],
      },
      create(context) {
        const allowedWeights = ['400', '500', '600', '700']
        
        return {
          Property(node) {
            if (node.key && node.key.name === 'fontWeight' && node.value) {
              const weight = node.value.value || node.value.name
              if (weight && !allowedWeights.includes(String(weight))) {
                context.report({
                  node,
                  message: `Font weight "${weight}" not allowed. Use: ${allowedWeights.join(', ')}`,
                })
              }
            }
          },
        }
      },
    },

    // Prevent direct Radix UI imports (must use shadcn/ui)
    'no-direct-radix-imports': {
      meta: {
        type: 'problem',
        docs: {
          description: 'Prevent direct @radix-ui imports, use shadcn/ui components instead',
        },
        fixable: null,
        schema: [],
      },
      create(context) {
        return {
          ImportDeclaration(node) {
            if (node.source.value.startsWith('@radix-ui/')) {
              context.report({
                node,
                message: 'Direct @radix-ui imports not allowed. Use shadcn/ui components from @/components/ui',
              })
            }
          },
        }
      },
    },

    // Ensure semantic color usage
    'use-semantic-colors': {
      meta: {
        type: 'suggestion',
        docs: {
          description: 'Encourage use of semantic color tokens instead of hardcoded colors',
        },
        fixable: null,
        schema: [],
      },
      create(context) {
        return {
          Literal(node) {
            if (typeof node.value === 'string') {
              // Check for hardcoded hex colors
              const hexMatch = node.value.match(/#[0-9a-fA-F]{3,6}/g)
              if (hexMatch) {
                context.report({
                  node,
                  message: `Hardcoded color "${node.value}". Use semantic tokens like "hsl(var(--primary))"`,
                })
              }
            }
          },
        }
      },
    },
  },
};