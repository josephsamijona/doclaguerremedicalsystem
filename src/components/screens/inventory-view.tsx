import React, { useState } from "react";
import {
  Box,
  Plus,
  Search,
  Filter,
  Glasses,
  SlidersHorizontal,
  ArrowUpDown,
  AlertTriangle,
  Layers,
  Sparkles,
  Barcode,
  Eye,
  Check,
} from "lucide-react";
import { useStore } from "@/src/lib/mock/store";
import { InventoryItem } from "@/src/types";
import { mockStockMovements } from "@/src/lib/mock/inventory";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { Input } from "@/src/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/src/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/src/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import { toast } from "sonner";

export function InventoryView() {
  const { inventory, updateStock } = useStore();

  const [activeTab, setActiveTab] = useState<"Frames" | "Lenses" | "Contacts" | "Accessories" | "Movements">("Frames");
  const [searchQuery, setSearchQuery] = useState("");
  const [brandFilter, setBrandFilter] = useState("ALL");
  const [adjustModalOpen, setAdjustModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [adjustQty, setAdjustQty] = useState(1);
  const [adjustReason, setAdjustReason] = useState("Stock receipt / supplier delivery");

  const frames = inventory.filter((i) => i.category === "Frames");
  const lenses = inventory.filter((i) => i.category === "Lenses");
  const contacts = inventory.filter((i) => i.category === "Contact Lenses");
  const accessories = inventory.filter((i) => ["Solutions", "Accessories"].includes(i.category));

  const filteredFrames = frames.filter((f) => {
    const matchesQuery = `${f.name} ${f.brand} ${f.sku} ${f.frameSpec?.shape} ${f.frameSpec?.color}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesBrand = brandFilter === "ALL" || f.brand === brandFilter;
    return matchesQuery && matchesBrand;
  });

  const lowStockCount = inventory.filter((i) => i.stockQty <= i.minStockLevel).length;

  const handleOpenAdjust = (item: InventoryItem) => {
    setSelectedItem(item);
    setAdjustQty(1);
    setAdjustModalOpen(true);
  };

  const handleConfirmAdjust = (type: "ADD" | "SUBTRACT") => {
    if (!selectedItem) return;
    const delta = type === "ADD" ? adjustQty : -adjustQty;
    updateStock(selectedItem.id, delta, adjustReason);
    setAdjustModalOpen(false);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Frames & Optical Inventory</h1>
            {lowStockCount > 0 && (
              <Badge variant="outline" className="text-xs">
                {lowStockCount} Low Stock Items
              </Badge>
            )}
          </div>
          <p className="text-xs sm:text-sm text-zinc-500">
            Designer eyewear catalog, ophthalmic semi-finished blanks, contact lenses, and real-time stock-take
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => {
              toast.success("Barcode scanner initialized and listening on COM4 (USB HID)");
            }}
            variant="outline"
            className="text-xs"
          >
            <Barcode className="mr-1.5 h-3.5 w-3.5" /> Scan Barcode
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v: any) => setActiveTab(v)}>
        <TabsList className="mb-4">
          <TabsTrigger value="Frames">Frames Catalog ({frames.length})</TabsTrigger>
          <TabsTrigger value="Lenses">Ophthalmic Lenses ({lenses.length})</TabsTrigger>
          <TabsTrigger value="Contacts">Contact Lenses ({contacts.length})</TabsTrigger>
          <TabsTrigger value="Accessories">Solutions & Accessories ({accessories.length})</TabsTrigger>
          <TabsTrigger value="Movements">Stock Movement Log</TabsTrigger>
        </TabsList>

        {/* TAB 1: FRAMES CATALOG GRID */}
        <TabsContent value="Frames" className="space-y-4">
          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
              <Input
                placeholder="Search frames by brand, model, SKU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 text-xs"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs text-zinc-500">Brand:</span>
              <select
                value={brandFilter}
                onChange={(e) => setBrandFilter(e.target.value)}
                className="rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-2 py-1 text-xs text-black dark:text-white"
              >
                <option value="ALL">All Brands</option>
                <option value="Ray-Ban">Ray-Ban</option>
                <option value="Tom Ford">Tom Ford</option>
                <option value="Oakley">Oakley</option>
                <option value="Gucci">Gucci</option>
                <option value="Silhouette">Silhouette</option>
                <option value="Prada">Prada</option>
                <option value="Nano Vista">Nano Vista (Kids)</option>
              </select>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredFrames.map((frame) => {
              const isLow = frame.stockQty <= frame.minStockLevel;

              return (
                <Card
                  key={frame.id}
                  className="overflow-hidden hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors flex flex-col justify-between"
                >
                  <div>
                    {/* Visual Frame Presentation Box */}
                    <div className="h-36 bg-zinc-100 dark:bg-zinc-900 flex flex-col items-center justify-center p-4 border-b border-zinc-200 dark:border-zinc-800 relative">
                      <Glasses className="h-14 w-14 text-zinc-800 dark:text-zinc-200 stroke-[1.25]" />
                      <span className="text-[10px] font-mono text-zinc-500 mt-2">
                        {frame.frameSpec?.size} · {frame.frameSpec?.shape}
                      </span>
                      {isLow && (
                        <Badge
                          variant="destructive"
                          className="absolute top-2 right-2 text-[9px] px-1.5 py-0"
                        >
                          Low: {frame.stockQty} left
                        </Badge>
                      )}
                    </div>

                    <div className="p-4 space-y-2">
                      <div>
                        <div className="text-[10px] text-zinc-400 uppercase tracking-wider font-semibold">
                          {frame.brand}
                        </div>
                        <h3 className="font-bold text-xs text-black dark:text-white line-clamp-1">
                          {frame.name}
                        </h3>
                        <div className="text-[11px] font-mono text-zinc-500 mt-0.5">
                          SKU: {frame.sku}
                        </div>
                      </div>

                      <div className="text-[11px] text-zinc-600 dark:text-zinc-400 space-y-0.5 pt-1 border-t border-zinc-100 dark:border-zinc-800">
                        <div>Color: {frame.frameSpec?.color}</div>
                        <div>Material: {frame.frameSpec?.material} ({frame.frameSpec?.rimType})</div>
                        <div>Location: {frame.location}</div>
                      </div>
                    </div>
                  </div>

                  {/* Price & Action Footer */}
                  <div className="p-4 pt-0 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-sm text-black dark:text-white">
                        {frame.retailPriceHTG.toLocaleString()} HTG
                      </div>
                      <div className="text-[10px] text-zinc-400 font-mono">
                        ≈ ${frame.retailPriceUSD} USD
                      </div>
                    </div>

                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 text-xs px-2"
                      onClick={() => handleOpenAdjust(frame)}
                    >
                      Stock ({frame.stockQty})
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* TAB 2: OPHTHALMIC LENSES TABLE */}
        <TabsContent value="Lenses">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>SKU</TableHead>
                    <TableHead>Design & Material</TableHead>
                    <TableHead>Index</TableHead>
                    <TableHead>Coating Treatment</TableHead>
                    <TableHead>Cost Price</TableHead>
                    <TableHead>Retail (HTG)</TableHead>
                    <TableHead>In Stock</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lenses.map((lens) => (
                    <TableRow key={lens.id}>
                      <TableCell className="font-mono text-xs font-bold">{lens.sku}</TableCell>
                      <TableCell className="text-xs font-medium">{lens.name}</TableCell>
                      <TableCell className="text-xs">{lens.lensSpec?.index}</TableCell>
                      <TableCell className="text-xs">{lens.lensSpec?.coating}</TableCell>
                      <TableCell className="text-xs text-zinc-500 font-mono">{lens.costPriceHTG.toLocaleString()} G</TableCell>
                      <TableCell className="text-xs font-bold font-mono">{lens.retailPriceHTG.toLocaleString()} G</TableCell>
                      <TableCell>
                        <Badge variant={lens.stockQty <= lens.minStockLevel ? "destructive" : "secondary"}>
                          {lens.stockQty} pairs
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs"
                          onClick={() => handleOpenAdjust(lens)}
                        >
                          Adjust
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 3: CONTACT LENSES TABLE */}
        <TabsContent value="Contacts">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>SKU</TableHead>
                    <TableHead>Brand & Product</TableHead>
                    <TableHead>Base Curve / Dia</TableHead>
                    <TableHead>Power Range</TableHead>
                    <TableHead>Retail (HTG)</TableHead>
                    <TableHead>In Stock</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contacts.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell className="font-mono text-xs font-bold">{c.sku}</TableCell>
                      <TableCell className="text-xs font-medium">{c.name}</TableCell>
                      <TableCell className="text-xs">{c.contactLensSpec?.bc} / {c.contactLensSpec?.dia}</TableCell>
                      <TableCell className="text-xs font-mono">{c.contactLensSpec?.powerRange}</TableCell>
                      <TableCell className="text-xs font-bold">{c.retailPriceHTG.toLocaleString()} G</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{c.stockQty} boxes</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs"
                          onClick={() => handleOpenAdjust(c)}
                        >
                          Adjust
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 4: ACCESSORIES TABLE */}
        <TabsContent value="Accessories">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>SKU</TableHead>
                    <TableHead>Product Name</TableHead>
                    <TableHead>Brand</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Retail (HTG)</TableHead>
                    <TableHead>In Stock</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {accessories.map((acc) => (
                    <TableRow key={acc.id}>
                      <TableCell className="font-mono text-xs font-bold">{acc.sku}</TableCell>
                      <TableCell className="text-xs font-medium">{acc.name}</TableCell>
                      <TableCell className="text-xs">{acc.brand}</TableCell>
                      <TableCell className="text-xs">{acc.location}</TableCell>
                      <TableCell className="text-xs font-bold">{acc.retailPriceHTG.toLocaleString()} G</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{acc.stockQty} units</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs"
                          onClick={() => handleOpenAdjust(acc)}
                        >
                          Adjust
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 5: MOVEMENTS LOG */}
        <TabsContent value="Movements">
          <Card>
            <CardHeader className="p-5 pb-3">
              <CardTitle className="text-sm font-semibold">Inventory Audit & Stock Movement Log</CardTitle>
              <CardDescription className="text-xs">
                Real-time tracking of dispensary sales, workshop consumption, and supplier deliveries
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Item Name</TableHead>
                    <TableHead>Change</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Authorized By</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockStockMovements.map((m) => (
                    <TableRow key={m.id}>
                      <TableCell className="font-mono text-xs">{m.date}</TableCell>
                      <TableCell className="font-mono text-xs font-bold">{m.itemId}</TableCell>
                      <TableCell className="text-xs font-medium">{m.itemName}</TableCell>
                      <TableCell>
                        <Badge variant={m.quantity > 0 ? "secondary" : "outline"} className="font-mono">
                          {m.quantity > 0 ? `+${m.quantity}` : m.quantity}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-zinc-600 dark:text-zinc-400">{m.notes || m.type}</TableCell>
                      <TableCell className="text-xs">{m.performedBy}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Stock Adjustment Modal */}
      <Dialog open={adjustModalOpen} onOpenChange={setAdjustModalOpen}>
        <DialogContent onClose={() => setAdjustModalOpen(false)} className="max-w-md">
          <DialogHeader>
            <DialogTitle>Adjust Stock: {selectedItem?.name}</DialogTitle>
            <DialogDescription>
              Current Quantity on Hand: <span className="font-bold">{selectedItem?.stockQty}</span> units
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 text-xs py-2">
            <div>
              <label className="block text-zinc-500 mb-1 font-medium">Quantity Delta</label>
              <Input
                type="number"
                min="1"
                value={adjustQty}
                onChange={(e) => setAdjustQty(parseInt(e.target.value) || 1)}
              />
            </div>

            <div>
              <label className="block text-zinc-500 mb-1 font-medium">Adjustment Reason</label>
              <select
                value={adjustReason}
                onChange={(e) => setAdjustReason(e.target.value)}
                className="w-full h-9 rounded-md border border-zinc-300 dark:border-zinc-800 bg-transparent px-3 text-xs"
              >
                <option value="Stock receipt / supplier shipment">Stock receipt / supplier shipment</option>
                <option value="Dispensary sales dispense">Dispensary sales dispense</option>
                <option value="Damaged / Scratched in lab edging">Damaged / Scratched in lab edging</option>
                <option value="Physical stock-take correction">Physical stock-take correction</option>
                <option value="Return from patient">Return from patient</option>
              </select>
            </div>
          </div>

          <DialogFooter className="flex items-center justify-between sm:justify-between w-full">
            <Button
              variant="outline"
              className="text-xs"
              onClick={() => handleConfirmAdjust("SUBTRACT")}
            >
              - Deduct {adjustQty} Units
            </Button>
            <Button
              className="text-xs"
              onClick={() => handleConfirmAdjust("ADD")}
            >
              + Add {adjustQty} Units
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
