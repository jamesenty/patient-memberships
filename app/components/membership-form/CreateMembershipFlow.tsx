"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { Checkbox } from "../ui/Checkbox";
import { SegmentedToggle } from "../ui/SegmentedToggle";
import {
  formatInclusionSummary,
  type InclusionKind,
  type MembershipInclusion,
  perkLibrary,
  serviceCadenceOptions,
  serviceCatalog,
  serviceCategories,
} from "./inclusions";
import styles from "./create-membership.module.css";

type Frequency = "Weekly" | "Monthly" | "Quarterly" | "Annual";
type BillingDate = "Membership start date" | "Start of month + pro-rata";
type Duration = "ongoing" | "timebound";

type ServiceSelectionOption = {
  id: string;
  label: string;
  category: string;
  type: "category" | "specific";
  price: number | null;
};

type ServiceCategoryGroup = {
  category: string;
  categoryOptionId: string;
  products: {
    id: string;
    optionId: string;
    name: string;
    price: number;
  }[];
};

const inclusionTypeTabs: { id: InclusionKind; label: string }[] = [
  { id: "service", label: "Service" },
  { id: "discount", label: "Discount" },
  { id: "perk", label: "Perk" },
];

function generateId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    maximumFractionDigits: 0,
  }).format(value);

export function CreateMembershipFlow() {
  const [membershipName, setMembershipName] = useState("Gold Tier");
  const [description, setDescription] = useState(
    "Premium plan for patients booking injectables and skin treatments on a regular cadence.",
  );
  const [price, setPrice] = useState("349");
  const [frequency, setFrequency] = useState<Frequency>("Monthly");
  const [billingDate, setBillingDate] = useState<BillingDate>("Membership start date");
  const [salesTax, setSalesTax] = useState(true);
  const [duration, setDuration] = useState<Duration>("ongoing");
  const [durationMonths, setDurationMonths] = useState("12");
  const [minimumCommitment, setMinimumCommitment] = useState("3");
  const [noticePeriod, setNoticePeriod] = useState("30");
  const [cancellationFee, setCancellationFee] = useState("99");

  const [inclusions, setInclusions] = useState<MembershipInclusion[]>([
    {
      id: generateId("service"),
      kind: "service",
      category: "Anti-wrinkle treatments",
      targetType: "specific",
      targetLabel: "Botox",
      quantity: 15,
      unit: "units",
      cadence: "Every 3 months",
    },
    {
      id: generateId("service"),
      kind: "service",
      category: "Skin resurfacing",
      targetType: "specific",
      targetLabel: "Chemical peel",
      quantity: 1,
      unit: "session",
      cadence: "Every month",
    },
    {
      id: generateId("discount"),
      kind: "discount",
      appliesTo: "all",
      targetLabel: "All skincare retail",
      amountType: "percent",
      amount: 10,
    },
  ]);

  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [panelKind, setPanelKind] = useState<InclusionKind>("service");
  const [editingInclusionId, setEditingInclusionId] = useState<string | null>(null);

  const [serviceSelectionSearch, setServiceSelectionSearch] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [selectedServiceOptionId, setSelectedServiceOptionId] = useState<string | null>(
    "specific:botox-15-units",
  );

  const [serviceQuantity, setServiceQuantity] = useState("1");
  const [serviceUnit, setServiceUnit] = useState<"units" | "session">("session");
  const [serviceCadence, setServiceCadence] = useState<(typeof serviceCadenceOptions)[number]>(
    "Every month",
  );

  const [discountAppliesTo, setDiscountAppliesTo] = useState<"all" | "category" | "specific">("all");
  const [discountCategory, setDiscountCategory] = useState(serviceCategories[0]);
  const [discountServiceId, setDiscountServiceId] = useState(serviceCatalog[0].id);
  const [discountAmountType, setDiscountAmountType] = useState<"percent" | "fixed">("percent");
  const [discountAmount, setDiscountAmount] = useState("10");

  const [perkLabel, setPerkLabel] = useState(perkLibrary[0]);
  const [perkCadence, setPerkCadence] = useState<"Always" | "Monthly" | "Quarterly">("Always");

  const serviceSelectionOptions = useMemo<ServiceSelectionOption[]>(() => {
    const categoryOptions: ServiceSelectionOption[] = serviceCategories.map((category) => ({
      id: `category:${category}`,
      label: category,
      category,
      type: "category",
      price: null,
    }));

    const treatmentOptions: ServiceSelectionOption[] = serviceCatalog.map((item) => ({
      id: `specific:${item.id}`,
      label: item.name,
      category: item.category,
      type: "specific",
      price: item.price,
    }));

    return [...categoryOptions, ...treatmentOptions];
  }, []);

  const filteredCategoryGroups = useMemo<ServiceCategoryGroup[]>(() => {
    const search = serviceSelectionSearch.trim().toLowerCase();

    return serviceCategories
      .map((category) => {
        const products = serviceCatalog
          .filter((item) => item.category === category)
          .map((item) => ({
            id: item.id,
            optionId: `specific:${item.id}`,
            name: item.name,
            price: item.price,
          }));

        if (!search) {
          return {
            category,
            categoryOptionId: `category:${category}`,
            products,
          };
        }

        const categoryMatches = category.toLowerCase().includes(search);
        const matchingProducts = products.filter((item) => item.name.toLowerCase().includes(search));

        if (!categoryMatches && matchingProducts.length === 0) {
          return null;
        }

        return {
          category,
          categoryOptionId: `category:${category}`,
          products: categoryMatches ? products : matchingProducts,
        };
      })
      .filter((group): group is ServiceCategoryGroup => group !== null);
  }, [serviceSelectionSearch]);

  const selectedServiceOption = useMemo(
    () => serviceSelectionOptions.find((option) => option.id === selectedServiceOptionId) ?? null,
    [serviceSelectionOptions, selectedServiceOptionId],
  );
  const selectedServiceCount = selectedServiceOption ? 1 : 0;
  const selectedServicePreview =
    selectedServiceCount === 0
      ? "No service selected"
      : selectedServiceOption?.label ?? "No service selected";

  const selectedDiscountService =
    serviceCatalog.find((item) => item.id === discountServiceId) ?? serviceCatalog[0];

  const previewPrice = useMemo(() => {
    if (!price) {
      return "$0";
    }

    return formatCurrency(Number(price));
  }, [price]);

  const inclusionCounts = useMemo(
    () => ({
      service: inclusions.filter((item) => item.kind === "service").length,
      discount: inclusions.filter((item) => item.kind === "discount").length,
      perk: inclusions.filter((item) => item.kind === "perk").length,
    }),
    [inclusions],
  );

  const openPanel = (kind: InclusionKind) => {
    setPanelKind(kind);
    setEditingInclusionId(null);
    setIsPanelOpen(true);
  };

  const closePanel = () => {
    setEditingInclusionId(null);
    setIsPanelOpen(false);
  };

  const upsertInclusion = (next: MembershipInclusion, closePanelOnComplete = true) => {
    setInclusions((current) => {
      if (!editingInclusionId) {
        return [...current, next];
      }

      return current.map((item) => (item.id === editingInclusionId ? { ...next, id: item.id } : item));
    });
    setEditingInclusionId(null);
    if (closePanelOnComplete) {
      setIsPanelOpen(false);
    }
  };

  const addServiceInclusion = () => {
    if (!selectedServiceOption) {
      return;
    }

    const isEditing = Boolean(editingInclusionId);
    const quantity = Number(serviceQuantity) || 1;

    upsertInclusion(
      {
        id: generateId("service"),
        kind: "service" as const,
        category: selectedServiceOption.category,
        targetType: selectedServiceOption.type,
        targetLabel: selectedServiceOption.label,
        quantity,
        unit: serviceUnit,
        cadence: serviceCadence,
      },
      isEditing,
    );

    setSelectedServiceOptionId(null);
    setServiceSelectionSearch("");
    setServiceQuantity("1");
    setServiceUnit("session");
    setServiceCadence("Every month");
  };

  const addDiscountInclusion = () => {
    const isEditing = Boolean(editingInclusionId);
    const targetLabel =
      discountAppliesTo === "all"
        ? "All treatments and products"
        : discountAppliesTo === "category"
          ? `${discountCategory} category`
          : selectedDiscountService.name;

    upsertInclusion(
      {
        id: generateId("discount"),
        kind: "discount",
        appliesTo: discountAppliesTo,
        targetLabel,
        amountType: discountAmountType,
        amount: Number(discountAmount) || 0,
      },
      isEditing,
    );

    setDiscountAppliesTo("all");
    setDiscountCategory(serviceCategories[0]);
    setDiscountServiceId(serviceCatalog[0].id);
    setDiscountAmountType("percent");
    setDiscountAmount("10");
  };

  const addPerkInclusion = () => {
    const isEditing = Boolean(editingInclusionId);

    upsertInclusion(
      {
        id: generateId("perk"),
        kind: "perk",
        label: perkLabel,
        cadence: perkCadence,
      },
      isEditing,
    );

    setPerkLabel(perkLibrary[0]);
    setPerkCadence("Always");
  };

  const toggleServiceSelection = (optionId: string) => {
    setSelectedServiceOptionId((current) => (current === optionId ? null : optionId));
  };

  const toggleCategoryExpanded = (category: string) => {
    setExpandedCategories((current) =>
      current.includes(category)
        ? current.filter((entry) => entry !== category)
        : [...current, category],
    );
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  const clearServiceSelection = () => {
    setSelectedServiceOptionId(null);
    setServiceSelectionSearch("");
  };

  const startEditInclusion = (inclusion: MembershipInclusion) => {
    setEditingInclusionId(inclusion.id);
    setPanelKind(inclusion.kind);
    setIsPanelOpen(true);

    if (inclusion.kind === "service") {
      const matchedOption =
        serviceSelectionOptions.find(
          (option) =>
            option.type === inclusion.targetType &&
            option.label === inclusion.targetLabel &&
            option.category === inclusion.category,
        ) ?? null;

      setSelectedServiceOptionId(matchedOption?.id ?? null);
      setServiceQuantity(String(inclusion.quantity));
      setServiceUnit(inclusion.unit);
      setServiceCadence(inclusion.cadence);
      return;
    }

    if (inclusion.kind === "discount") {
      setDiscountAppliesTo(inclusion.appliesTo);
      setDiscountAmountType(inclusion.amountType);
      setDiscountAmount(String(inclusion.amount));

      if (inclusion.appliesTo === "category") {
        const category = serviceCategories.find((entry) =>
          inclusion.targetLabel.toLowerCase().startsWith(entry.toLowerCase()),
        );
        if (category) {
          setDiscountCategory(category);
        }
      }

      if (inclusion.appliesTo === "specific") {
        const service = serviceCatalog.find((entry) => entry.name === inclusion.targetLabel);
        if (service) {
          setDiscountServiceId(service.id);
        }
      }
      return;
    }

    setPerkLabel(inclusion.label);
    setPerkCadence(inclusion.cadence);
  };

  return (
    <main className={styles.page}>
      <form className={styles.layout} onSubmit={handleSubmit}>
        <div className={styles.formColumn}>
          <header className={styles.pageHeader}>
            <div>
              <Link className={styles.backLink} href="/">
                Memberships
              </Link>
              <h1>Create Membership</h1>
              <p>Define inclusions, pricing terms, cancellation rules, and publish when ready.</p>
            </div>
          </header>

          <section className={styles.section}>
            <h2>Offer Details</h2>
            <div className={styles.fieldGrid}>
              <label className={styles.field}>
                Membership Name
                <input
                  value={membershipName}
                  onChange={(event) => setMembershipName(event.target.value)}
                  placeholder="e.g. Platinum Membership"
                  required
                />
              </label>
              <label className={styles.fieldFull}>
                Description
                <textarea
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="Explain who this membership is for and what value it provides."
                  rows={4}
                />
              </label>
            </div>
          </section>

          <section className={styles.section}>
            <h2>Define Inclusions</h2>
            <p className={styles.sectionHint}>
              Use structured inclusions so plans stay consistent, searchable, and reportable.
            </p>

            <div className={styles.inclusionToolbar}>
              <button type="button" className={styles.ghostAction} onClick={() => openPanel("service")}>
                Add Service
              </button>
              <button type="button" className={styles.ghostAction} onClick={() => openPanel("discount")}>
                Add Discount
              </button>
              <button type="button" className={styles.ghostAction} onClick={() => openPanel("perk")}>
                Add Perk
              </button>
            </div>

            <div className={styles.inclusionStats}>
              <span>{inclusionCounts.service} services</span>
              <span>{inclusionCounts.discount} discounts</span>
              <span>{inclusionCounts.perk} perks</span>
            </div>

            <div className={styles.inclusionsTableWrap}>
              <table className={styles.inclusionsTable}>
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Details</th>
                    <th>Cadence</th>
                    <th aria-label="Actions" />
                  </tr>
                </thead>
                <tbody>
                  {inclusions.map((inclusion) => {
                    const summary = formatInclusionSummary(inclusion);

                    return (
                      <tr key={inclusion.id}>
                        <td>{summary.type}</td>
                        <td>{summary.detail}</td>
                        <td>{summary.cadence}</td>
                        <td>
                          <div className={styles.inclusionActions}>
                            <button
                              className={styles.editButton}
                              type="button"
                              onClick={() => startEditInclusion(inclusion)}
                            >
                              Edit
                            </button>
                            <button
                              className={styles.removeButton}
                              type="button"
                              onClick={() =>
                                setInclusions((current) =>
                                  current.filter((entry) => entry.id !== inclusion.id),
                                )
                              }
                            >
                              Remove
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          <section className={styles.section}>
            <h2>Set Pricing and Terms</h2>
            <div className={styles.fieldGridThree}>
              <label className={styles.field}>
                Price Amount
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={price}
                  onChange={(event) => setPrice(event.target.value)}
                />
              </label>
              <label className={styles.field}>
                Frequency
                <select
                  value={frequency}
                  onChange={(event) => setFrequency(event.target.value as Frequency)}
                >
                  <option>Weekly</option>
                  <option>Monthly</option>
                  <option>Quarterly</option>
                  <option>Annual</option>
                </select>
              </label>
              <label className={styles.field}>
                Billing Date
                <select
                  value={billingDate}
                  onChange={(event) => setBillingDate(event.target.value as BillingDate)}
                >
                  <option>Membership start date</option>
                  <option>Start of month + pro-rata</option>
                </select>
              </label>
            </div>

            <div className={styles.toggleRow}>
              <span>Apply Sales Tax</span>
              <button
                type="button"
                className={salesTax ? styles.toggleOn : styles.toggleOff}
                onClick={() => setSalesTax((current) => !current)}
                aria-label="Toggle sales tax"
              >
                <span />
              </button>
            </div>

            <div className={styles.durationWrap}>
              <p className={styles.rowLabel}>Duration</p>
              <label className={styles.radioRow}>
                <input
                  type="radio"
                  name="duration"
                  checked={duration === "ongoing"}
                  onChange={() => setDuration("ongoing")}
                />
                Ongoing
              </label>
              <label className={styles.radioRow}>
                <input
                  type="radio"
                  name="duration"
                  checked={duration === "timebound"}
                  onChange={() => setDuration("timebound")}
                />
                Timebound
              </label>
              {duration === "timebound" ? (
                <label className={styles.fieldInline}>
                  Term length (months)
                  <input
                    type="number"
                    min="1"
                    value={durationMonths}
                    onChange={(event) => setDurationMonths(event.target.value)}
                  />
                </label>
              ) : null}
            </div>
          </section>

          <section className={styles.section}>
            <h2>Cancellation Policy</h2>
            <div className={styles.fieldGridThree}>
              <label className={styles.field}>
                Minimum Commitment (months)
                <input
                  type="number"
                  min="0"
                  value={minimumCommitment}
                  onChange={(event) => setMinimumCommitment(event.target.value)}
                />
              </label>
              <label className={styles.field}>
                Notice Period (days)
                <input
                  type="number"
                  min="0"
                  value={noticePeriod}
                  onChange={(event) => setNoticePeriod(event.target.value)}
                />
              </label>
              <label className={styles.field}>
                Cancellation Fee
                <input
                  type="number"
                  min="0"
                  value={cancellationFee}
                  onChange={(event) => setCancellationFee(event.target.value)}
                />
              </label>
            </div>
          </section>

          <footer className={styles.actions}>
            <Link className={styles.cancelButton} href="/">
              Cancel
            </Link>
            <button className={styles.publishButton} type="submit">
              Publish Offer
            </button>
          </footer>
        </div>

        <aside className={styles.previewColumn}>
          <div className={styles.previewCard}>
            <h3>Offer Preview</h3>
            <p className={styles.previewName}>{membershipName || "Untitled Membership"}</p>
            <p className={styles.previewDescription}>{description || "Add a short description."}</p>
            <dl className={styles.previewMeta}>
              <div>
                <dt>Pricing</dt>
                <dd>
                  {previewPrice} / {frequency.toLowerCase()}
                </dd>
              </div>
              <div>
                <dt>Billing</dt>
                <dd>{billingDate}</dd>
              </div>
              <div>
                <dt>Duration</dt>
                <dd>{duration === "ongoing" ? "Ongoing" : `${durationMonths || "0"} months`}</dd>
              </div>
            </dl>
            <p className={styles.previewLabel}>Inclusions</p>
            <ul className={styles.previewList}>
              {inclusions.map((item) => (
                <li key={`preview-${item.id}`}>{formatInclusionSummary(item).detail}</li>
              ))}
            </ul>
          </div>
        </aside>
      </form>

      {isPanelOpen ? (
        <div className={styles.panelOverlay} role="dialog" aria-modal="true" aria-label="Add inclusion">
          <div className={styles.sidePanel}>
            <div className={styles.panelHeader}>
              <h3>Add Inclusion</h3>
              <button type="button" className={styles.closePanel} onClick={closePanel}>
                Close
              </button>
            </div>

            <SegmentedToggle
              ariaLabel="Inclusion types"
              options={inclusionTypeTabs}
              value={panelKind}
              onChange={(kind) => {
                setPanelKind(kind);
                setEditingInclusionId(null);
              }}
            />

            {panelKind === "service" ? (
              <div className={styles.panelBody}>
                <div className={styles.serviceSelectorCard}>
                  <p className={styles.rowLabel}>Select categories or treatments</p>
                  <div className={styles.serviceModalControls}>
                    <input
                      value={serviceSelectionSearch}
                      onChange={(event) => setServiceSelectionSearch(event.target.value)}
                      placeholder="Search by name"
                    />
                  </div>

                  <div className={styles.categoryTree}>
                    {filteredCategoryGroups.map((group) => {
                      const isCategorySelected = selectedServiceOptionId === group.categoryOptionId;
                      const isExpanded =
                        serviceSelectionSearch.trim().length > 0 || expandedCategories.includes(group.category);

                      return (
                        <div className={styles.categoryBlock} key={group.category}>
                          <div className={styles.categoryRow}>
                            <button
                              type="button"
                              className={styles.expandButton}
                              onClick={() => toggleCategoryExpanded(group.category)}
                              aria-label={`Toggle ${group.category}`}
                            >
                              {isExpanded ? "▾" : "▸"}
                            </button>
                            <Checkbox
                              checked={isCategorySelected}
                              ariaLabel={`Select ${group.category}`}
                              onChange={() => toggleServiceSelection(group.categoryOptionId)}
                            />
                            <div className={styles.categoryLabelWrap}>
                              <p>{group.category}</p>
                              <span>Category inclusion</span>
                            </div>
                          </div>

                          {isExpanded ? (
                            <ul className={styles.productList}>
                              {group.products.map((product) => {
                                const isProductSelected = selectedServiceOptionId === product.optionId;

                                return (
                                  <li key={product.id} className={styles.productRow}>
                                    <span />
                                    <Checkbox
                                      checked={isProductSelected}
                                      ariaLabel={`Select ${product.name}`}
                                      onChange={() => toggleServiceSelection(product.optionId)}
                                    />
                                    <div className={styles.productLabelWrap}>
                                      <p>{product.name}</p>
                                      <span>{formatCurrency(product.price)}</span>
                                    </div>
                                  </li>
                                );
                              })}
                            </ul>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>
                  <p className={styles.selectionCount}>{selectedServiceCount} selected</p>
                </div>

                <p className={styles.selectionInline}>
                  <strong>{selectedServiceCount} selected:</strong> {selectedServicePreview}
                </p>
                <div className={styles.selectionActions}>
                  <button
                    type="button"
                    className={styles.clearSelectionButton}
                    onClick={clearServiceSelection}
                    disabled={selectedServiceCount === 0}
                  >
                    Clear selection
                  </button>
                </div>

                <div className={selectedServiceCount === 0 ? styles.configDisabled : styles.configEnabled}>
                  <div className={styles.fieldGridTwo}>
                    <label className={styles.field}>
                      Quantity
                      <input
                        type="number"
                        min="1"
                        value={serviceQuantity}
                        onChange={(event) => setServiceQuantity(event.target.value)}
                        disabled={selectedServiceCount === 0}
                      />
                    </label>
                    <label className={styles.field}>
                      Unit
                      <select
                        value={serviceUnit}
                        onChange={(event) => setServiceUnit(event.target.value as "units" | "session")}
                        disabled={selectedServiceCount === 0}
                      >
                        <option value="units">Units</option>
                        <option value="session">Session(s)</option>
                      </select>
                    </label>
                  </div>

                  <label className={styles.field}>
                    Service cadence
                    <select
                      value={serviceCadence}
                      onChange={(event) =>
                        setServiceCadence(event.target.value as (typeof serviceCadenceOptions)[number])
                      }
                      disabled={selectedServiceCount === 0}
                    >
                      {serviceCadenceOptions.map((option) => (
                        <option key={option}>{option}</option>
                      ))}
                    </select>
                  </label>
                </div>

                <button
                  type="button"
                  className={styles.panelPrimary}
                  onClick={addServiceInclusion}
                  disabled={selectedServiceCount === 0}
                >
                  {selectedServiceCount === 0
                    ? "Choose a service to continue"
                    : editingInclusionId
                      ? "Update Service Inclusion"
                      : "Add Service Inclusion"}
                </button>
              </div>
            ) : null}

            {panelKind === "discount" ? (
              <div className={styles.panelBody}>
                <p className={styles.sectionHint}>
                  Recommended: category-level discounts for cleaner reporting and fewer overrides.
                </p>

                <label className={styles.field}>
                  Applies to
                  <select
                    value={discountAppliesTo}
                    onChange={(event) => setDiscountAppliesTo(event.target.value as "all" | "category" | "specific")}
                  >
                    <option value="all">All treatments and products</option>
                    <option value="category">Specific category</option>
                    <option value="specific">Specific treatment/product</option>
                  </select>
                </label>

                {discountAppliesTo === "category" ? (
                  <label className={styles.field}>
                    Category
                    <select value={discountCategory} onChange={(event) => setDiscountCategory(event.target.value)}>
                      {serviceCategories.map((category) => (
                        <option key={category}>{category}</option>
                      ))}
                    </select>
                  </label>
                ) : null}

                {discountAppliesTo === "specific" ? (
                  <label className={styles.field}>
                    Treatment
                    <select
                      value={discountServiceId}
                      onChange={(event) => setDiscountServiceId(event.target.value)}
                    >
                      {serviceCatalog.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.category} · {item.name}
                        </option>
                      ))}
                    </select>
                  </label>
                ) : null}

                <div className={styles.fieldGridTwo}>
                  <label className={styles.field}>
                    Discount type
                    <select
                      value={discountAmountType}
                      onChange={(event) =>
                        setDiscountAmountType(event.target.value as "percent" | "fixed")
                      }
                    >
                      <option value="percent">Percent (%)</option>
                      <option value="fixed">Fixed amount ($)</option>
                    </select>
                  </label>
                  <label className={styles.field}>
                    Amount
                    <input
                      type="number"
                      min="0"
                      value={discountAmount}
                      onChange={(event) => setDiscountAmount(event.target.value)}
                    />
                  </label>
                </div>

                <button type="button" className={styles.panelPrimary} onClick={addDiscountInclusion}>
                  {editingInclusionId ? "Update Discount Inclusion" : "Add Discount Inclusion"}
                </button>
              </div>
            ) : null}

            {panelKind === "perk" ? (
              <div className={styles.panelBody}>
                <label className={styles.field}>
                  Perk type
                  <select value={perkLabel} onChange={(event) => setPerkLabel(event.target.value)}>
                    {perkLibrary.map((perk) => (
                      <option key={perk}>{perk}</option>
                    ))}
                  </select>
                </label>

                <label className={styles.field}>
                  Perk cadence
                  <select
                    value={perkCadence}
                    onChange={(event) =>
                      setPerkCadence(event.target.value as "Always" | "Monthly" | "Quarterly")
                    }
                  >
                    <option>Always</option>
                    <option>Monthly</option>
                    <option>Quarterly</option>
                  </select>
                </label>

                <button type="button" className={styles.panelPrimary} onClick={addPerkInclusion}>
                  {editingInclusionId ? "Update Perk Inclusion" : "Add Perk Inclusion"}
                </button>
              </div>
            ) : null}

            <div className={styles.panePreview}>
              <p className={styles.rowLabel}>Current inclusions ({inclusions.length})</p>
              <ul className={styles.panePreviewList}>
                {inclusions.length === 0 ? (
                  <li className={styles.selectionSummaryEmpty}>No inclusions yet</li>
                ) : (
                  inclusions.slice().reverse().map((item) => {
                    const summary = formatInclusionSummary(item);
                    return (
                      <li key={`pane-preview-${item.id}`}>
                        <span>{summary.type}</span>
                        <span>{summary.detail}</span>
                      </li>
                    );
                  })
                )}
              </ul>
            </div>

          </div>
        </div>
      ) : null}
    </main>
  );
}
