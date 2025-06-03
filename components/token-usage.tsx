import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { useTranslations } from '@/components/translations-context';
import { Message } from '@/types';

interface TokenUsageDisplayProps {
  msgs: any[];
}

export function TokenUsageDisplay({ msgs }: TokenUsageDisplayProps) {
  const { t } = useTranslations();
  return (
    <>
      {msgs.length > 0 && (
        <Accordion type='single' collapsible key='token-usage' className='w-full'>
          <AccordionItem value='token-usage'>
            <AccordionTrigger>
              <CardTitle className='text-sm font-medium'>{t('tokenUsage.usage')}</CardTitle>
            </AccordionTrigger>
            <AccordionContent>
              <Card>
                <CardContent>
                  <div className='mt-4 space-y-1'>
                    {msgs
                      .filter(msg => msg.type === 'response.done')
                      .slice(-1)
                      .map(msg => {
                        const tokenData = [
                          {
                            label: t('tokenUsage.total'),
                            value: msg.response?.usage?.total_tokens,
                          },
                          {
                            label: t('tokenUsage.input'),
                            value: msg.response?.usage?.input_tokens,
                          },
                          {
                            label: t('tokenUsage.output'),
                            value: msg.response?.usage?.output_tokens,
                          },
                        ];

                        return (
                          <Table key='token-usage-table'>
                            <TableBody>
                              {tokenData.map(({ label, value }) => (
                                <TableRow key={label}>
                                  <TableCell className='motion-preset-focus font-medium'>
                                    {label}
                                  </TableCell>
                                  <TableCell>{value}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        );
                      })}
                  </div>
                </CardContent>
              </Card>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}
    </>
  );
}
