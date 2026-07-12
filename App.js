import React, { useState, createContext, useContext } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Modal,
  Alert,
  SafeAreaView,
  StatusBar,
  FlatList,
  Dimensions
} from 'react-native';
import {
  HeartPulse,
  ShoppingBag,
  Calendar,
  Plus,
  Trash2,
  Search,
  Sparkles,
  Filter,
  CheckCircle,
  MapPin,
  Stethoscope,
  ChevronRight,
  User,
  Info,
  X
} from 'lucide-react-native';

// --- CONTEXT & STATE MANAGEMENT ---
const AppContext = createContext();

const initialProducts = [
  {
    id: '1',
    name: 'Alimento Premium Perro (15kg)',
    category: 'Mascotas',
    price: 45.00,
    image: 'https://images.unsplash.com/photo-1589723900644-648b209d846b?auto=format&fit=crop&q=80&w=400',
    description: 'Nutrición completa para perros adultos de razas medianas y grandes.'
  },
  {
    id: '2',
    name: 'Fertilizante Foliar Orgánico (1L)',
    category: 'Agro',
    price: 18.50,
    image: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?auto=format&fit=crop&q=80&w=400',
    description: 'Estimula el crecimiento foliar y fortalece las defensas naturales de las plantas.'
  },
  {
    id: '3',
    name: 'Desparasitante Bovino Ivermectina',
    category: 'Medicamentos',
    price: 32.00,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=400',
    description: 'Control efectivo de parásitos internos y externos en ganado bovino.'
  },
  {
    id: '4',
    name: 'Champú Antipulgas Hipoalergénico',
    category: 'Mascotas',
    price: 12.00,
    image: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&q=80&w=400',
    description: 'Fórmula suave para el cuidado de la piel y control de parásitos externos.'
  },
  {
    id: '5',
    name: 'Semillas de Alfalfa Saco (5kg)',
    category: 'Agro',
    price: 25.00,
    image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=400',
    description: 'Semilla de alta germinación ideal para pasturas de ganado.'
  },
  {
    id: '6',
    name: 'Antibiótico Amoxicilina Veterinaria',
    category: 'Medicamentos',
    price: 15.00,
    image: 'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?auto=format&fit=crop&q=80&w=400',
    description: 'Tratamiento de infecciones bacterianas en caninos, felinos y porcinos.'
  }
];

const initialPets = [
  {
    id: '1',
    name: 'Max',
    type: 'Mascota',
    breed: 'Golden Retriever',
    age: '3 años',
    owner: 'Carlos Gómez',
    history: 'Vacunas óctuple al día. Control de peso óptimo.'
  },
  {
    id: '2',
    name: 'Lola',
    type: 'Ganado',
    breed: 'Vaca Holstein',
    age: '4 años',
    owner: 'Rancho San Isidro',
    history: 'Control de mastitis negativo. Producción de leche estable.'
  }
];

const initialAppointments = [
  {
    id: '1',
    petName: 'Max',
    type: 'Clínica',
    date: '2024-11-25',
    time: '10:00 AM',
    reason: 'Control de vacunas anual'
  },
  {
    id: '2',
    petName: 'Lote Ganado Holstein',
    type: 'Visita de Campo',
    date: '2024-11-28',
    time: '08:00 AM',
    reason: 'Chequeo reproductivo y ecografías'
  }
];

export function AppProvider({ children }) {
  const [pets, setPets] = useState(initialPets);
  const [appointments, setAppointments] = useState(initialAppointments);
  const [cart, setCart] = useState([]);
  const [products] = useState(initialProducts);

  const addPet = (pet) => {
    setPets([...pets, { ...pet, id: Date.now().toString() }]);
  };

  const addAppointment = (appointment) => {
    setAppointments([...appointments, { ...appointment, id: Date.now().toString() }]);
  };

  const addToCart = (product) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      setCart(cart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <AppContext.Provider value={{
      pets,
      addPet,
      appointments,
      addAppointment,
      cart,
      addToCart,
      removeFromCart,
      clearCart,
      products
    }}>
      {children}
    </AppContext.Provider>
  );
}

// --- MAIN APP COMPONENT ---
export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}

function MainLayout() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [cartModalVisible, setCartModalVisible] = useState(false);
  const { cart, removeFromCart, clearCart } = useContext(AppContext);

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleCheckout = () => {
    Alert.alert(
      '¡Pedido Confirmado!',
      'Su pedido de Agro-Veterinaria ha sido registrado con éxito. Nos pondremos en contacto para coordinar la entrega.',
      [
        {
          text: 'Entendido',
          onPress: () => {
            clearCart();
            setCartModalVisible(false);
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1B5E20" />
      
      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerSubtitle}>Agro-Veterinaria & Pet Shop</Text>
          <Text style={styles.headerTitle}>PAWPET CLINIC</Text>
        </View>
        <TouchableOpacity 
          style={styles.cartButton}
          onPress={() => setCartModalVisible(true)}
        >
          <ShoppingBag color="#FFFFFF" size={24} />
          {cart.length > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cart.reduce((sum, i) => sum + i.quantity, 0)}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* MAIN SCREEN CONTAINER */}
      <View style={styles.content}>
        {activeTab === 'dashboard' && <DashboardScreen setActiveTab={setActiveTab} />}
        {activeTab === 'pets' && <PetsScreen />}
        {activeTab === 'store' && <StoreScreen />}
        {activeTab === 'agenda' && <AgendaScreen />}
      </View>

      {/* NAVIGATION BAR */}
      <View style={styles.navBar}>
        <TouchableOpacity 
          style={[styles.navItem, activeTab === 'dashboard' && styles.navItemActive]} 
          onPress={() => setActiveTab('dashboard')}
        >
          <Sparkles color={activeTab === 'dashboard' ? '#2E7D32' : '#757575'} size={22} />
          <Text style={[styles.navText, activeTab === 'dashboard' && styles.navTextActive]}>Inicio</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.navItem, activeTab === 'pets' && styles.navItemActive]} 
          onPress={() => setActiveTab('pets')}
        >
          <HeartPulse color={activeTab === 'pets' ? '#2E7D32' : '#757575'} size={22} />
          <Text style={[styles.navText, activeTab === 'pets' && styles.navTextActive]}>Mascotas</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.navItem, activeTab === 'store' && styles.navItemActive]} 
          onPress={() => setActiveTab('store')}
        >
          <ShoppingBag color={activeTab === 'store' ? '#2E7D32' : '#757575'} size={22} />
          <Text style={[styles.navText, activeTab === 'store' && styles.navTextActive]}>Tienda</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.navItem, activeTab === 'agenda' && styles.navItemActive]} 
          onPress={() => setActiveTab('agenda')}
        >
          <Calendar color={activeTab === 'agenda' ? '#2E7D32' : '#757575'} size={22} />
          <Text style={[styles.navText, activeTab === 'agenda' && styles.navTextActive]}>Agenda</Text>
        </TouchableOpacity>
      </View>

      {/* CART MODAL */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={cartModalVisible}
        onRequestClose={() => setCartModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.cartModalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Carrito de Compras</Text>
              <TouchableOpacity onPress={() => setCartModalVisible(false)}>
                <X color="#333" size={24} />
              </TouchableOpacity>
            </View>

            {cart.length === 0 ? (
              <View style={styles.emptyCart}>
                <ShoppingBag color="#BDBDBD" size={64} />
                <Text style={styles.emptyCartText}>Tu carrito está vacío</Text>
                <Text style={styles.emptyCartSub}>¡Explora nuestra tienda agro-veterinaria!</Text>
              </View>
            ) : (
              <>
                <FlatList
                  data={cart}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <View style={styles.cartItem}>
                      <Image source={{ uri: item.image }} style={styles.cartItemImage} />
                      <View style={styles.cartItemDetails}>
                        <Text style={styles.cartItemName} numberOfLines={1}>{item.name}</Text>
                        <Text style={styles.cartItemCategory}>{item.category}</Text>
                        <Text style={styles.cartItemPrice}>${item.price.toFixed(2)} x {item.quantity}</Text>
                      </View>
                      <TouchableOpacity 
                        style={styles.cartItemRemove}
                        onPress={() => removeFromCart(item.id)}
                      >
                        <Trash2 color="#D32F2F" size={20} />
                      </TouchableOpacity>
                    </View>
                  )}
                  style={{ maxHeight: 300 }}
                />
                <View style={styles.cartSummary}>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Total a Pagar:</Text>
                    <Text style={styles.summaryValue}>${cartTotal.toFixed(2)} USD</Text>
                  </View>
                  <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
                    <Text style={styles.checkoutButtonText}>Confirmar Pedido</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// --- SCREEN 1: DASHBOARD ---
function DashboardScreen({ setActiveTab }) {
  const { pets, appointments } = useContext(AppContext);

  return (
    <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
      {/* HERO BANNER */}
      <View style={styles.heroBanner}>
        <View style={styles.heroTextContainer}>
          <Text style={styles.heroTitle}>Cuidado Profesional</Text>
          <Text style={styles.heroSubtitle}>Para tus mascotas y ganado de producción.</Text>
          <TouchableOpacity style={styles.heroButton} onPress={() => setActiveTab('agenda')}>
            <Text style={styles.heroButtonText}>Reservar Cita</Text>
          </TouchableOpacity>
        </View>
        <Image 
          source={{ uri: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&q=80&w=400' }} 
          style={styles.heroImage} 
        />
      </View>

      {/* QUICK STATS */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <HeartPulse color="#2E7D32" size={28} />
          <Text style={styles.statNumber}>{pets.length}</Text>
          <Text style={styles.statLabel}>Animales Reg.</Text>
        </View>
        <View style={styles.statCard}>
          <Calendar color="#EF6C00" size={28} />
          <Text style={styles.statNumber}>{appointments.length}</Text>
          <Text style={styles.statLabel}>Citas Pendientes</Text>
        </View>
      </View>

      {/* CLINIC SERVICES PREVIEW */}
      <Text style={styles.sectionTitle}>Nuestros Servicios Integrales</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.servicesScroll}>
        <View style={styles.serviceCard}>
          <Stethoscope color="#2E7D32" size={32} />
          <Text style={styles.serviceCardTitle}>Consulta Veterinaria</Text>
          <Text style={styles.serviceCardDesc}>Atención médica experta para mascotas de compañía.</Text>
        </View>
        <View style={styles.serviceCard}>
          <MapPin color="#00838F" size={32} />
          <Text style={styles.serviceCardTitle}>Visita Técnica Campo</Text>
          <Text style={styles.serviceCardDesc}>Asistencia y control sanitario para ganadería y fincas.</Text>
        </View>
        <View style={styles.serviceCard}>
          <ShoppingBag color="#EF6C00" size={32} />
          <Text style={styles.serviceCardTitle}>Pet Shop & Agro</Text>
          <Text style={styles.serviceCardDesc}>Insumos agrícolas, alimentos y accesorios premium.</Text>
        </View>
      </ScrollView>

      {/* UPCOMING EVENTS PREVIEW */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Próximas Citas</Text>
        <TouchableOpacity onPress={() => setActiveTab('agenda')}>
          <Text style={styles.seeMoreText}>Ver todas</Text>
        </TouchableOpacity>
      </View>
      
      {appointments.slice(0, 2).map((apt) => (
        <View key={apt.id} style={styles.appointmentPreviewCard}>
          <View style={styles.appointmentIconContainer}>
            <Calendar color="#2E7D32" size={20} />
          </View>
          <View style={styles.appointmentDetails}>
            <Text style={styles.appointmentPet}>{apt.petName}</Text>
            <Text style={styles.appointmentType}>{apt.type} - {apt.reason}</Text>
            <Text style={styles.appointmentTimeText}>{apt.date} a las {apt.time}</Text>
          </View>
          <ChevronRight color="#BDBDBD" size={20} />
        </View>
      ))}
      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

// --- SCREEN 2: PETS & LIVESTOCK MANAGEMENT ---
function PetsScreen() {
  const { pets, addPet } = useContext(AppContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [filterType, setFilterType] = useState('Todos');
  
  // Form State
  const [name, setName] = useState('');
  const [type, setType] = useState('Mascota');
  const [breed, setBreed] = useState('');
  const [age, setAge] = useState('');
  const [owner, setOwner] = useState('');
  const [history, setHistory] = useState('');

  const handleAddPet = () => {
    if (!name || !breed || !owner) {
      Alert.alert('Campos incompletos', 'Por favor complete el nombre, raza y propietario.');
      return;
    }
    addPet({ name, type, breed, age, owner, history });
    setModalVisible(false);
    // Reset Form
    setName('');
    setType('Mascota');
    setBreed('');
    setAge('');
    setOwner('');
    setHistory('');
    Alert.alert('Registro Exitoso', 'El animal ha sido registrado en el sistema.');
  };

  const filteredPets = filterType === 'Todos' 
    ? pets 
    : pets.filter(p => p.type === filterType);

  return (
    <View style={styles.screenContainer}>
      <View style={styles.screenHeaderRow}>
        <Text style={styles.screenTitle}>Gestión Veterinaria</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
          <Plus color="#FFFFFF" size={18} />
          <Text style={styles.addButtonText}>Registrar</Text>
        </TouchableOpacity>
      </View>

      {/* Category Filter Tabs */}
      <View style={styles.tabFilterContainer}>
        {['Todos', 'Mascota', 'Ganado'].map((category) => (
          <TouchableOpacity
            key={category}
            style={[styles.tabFilterButton, filterType === category && styles.tabFilterButtonActive]}
            onPress={() => setFilterType(category)}
          >
            <Text style={[styles.tabFilterText, filterType === category && styles.tabFilterTextActive]}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredPets}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.petCard}>
            <View style={styles.petCardHeader}>
              <View>
                <Text style={styles.petNameText}>{item.name}</Text>
                <Text style={styles.petTypeText}>{item.type} • {item.breed}</Text>
              </View>
              <View style={[styles.badge, item.type === 'Mascota' ? styles.badgePet : styles.badgeLivestock]}>
                <Text style={styles.badgeText}>{item.type}</Text>
              </View>
            </View>
            <View style={styles.petCardBody}>
              <View style={styles.infoRow}>
                <User size={14} color="#757575" />
                <Text style={styles.infoLabel}>Propietario: </Text>
                <Text style={styles.infoValue}>{item.owner}</Text>
              </View>
              <View style={styles.infoRow}>
                <Info size={14} color="#757575" />
                <Text style={styles.infoLabel}>Edad: </Text>
                <Text style={styles.infoValue}>{item.age || 'No especificada'}</Text>
              </View>
              <View style={styles.clinicalHistoryContainer}>
                <Text style={styles.clinicalHistoryTitle}>Historial Clínico / Notas:</Text>
                <Text style={styles.clinicalHistoryText}>{item.history || 'Sin registros médicos registrados.'}</Text>
              </View>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <HeartPulse color="#BDBDBD" size={48} />
            <Text style={styles.emptyStateText}>No se encontraron registros.</Text>
          </View>
        }
      />

      {/* ADD PET MODAL */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <ScrollView style={styles.modalContent} contentContainerStyle={{ paddingBottom: 40 }}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Nuevo Registro Animal</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X color="#333" size={24} />
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>Tipo de Animal</Text>
            <View style={styles.selectorContainer}>
              <TouchableOpacity 
                style={[styles.selectorButton, type === 'Mascota' && styles.selectorButtonActive]} 
                onPress={() => setType('Mascota')}
              >
                <Text style={[styles.selectorText, type === 'Mascota' && styles.selectorTextActive]}>Mascota (Pet Shop)</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.selectorButton, type === 'Ganado' && styles.selectorButtonActive]} 
                onPress={() => setType('Ganado')}
              >
                <Text style={[styles.selectorText, type === 'Ganado' && styles.selectorTextActive]}>Ganado / Producción</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>Nombre o Identificador</Text>
            <TextInput 
              style={styles.input} 
              placeholder="Ej. Max, Vaca 042" 
              value={name}
              onChangeText={setName}
            />

            <Text style={styles.inputLabel}>Raza / Especie</Text>
            <TextInput 
              style={styles.input} 
              placeholder="Ej. Golden Retriever, Holstein, Porcino" 
              value={breed}
              onChangeText={setBreed}
            />

            <Text style={styles.inputLabel}>Edad / Tiempo</Text>
            <TextInput 
              style={styles.input} 
              placeholder="Ej. 2 años, 6 meses" 
              value={age}
              onChangeText={setAge}
            />

            <Text style={styles.inputLabel}>Propietario o Responsable</Text>
            <TextInput 
              style={styles.input} 
              placeholder="Nombre completo o Finca" 
              value={owner}
              onChangeText={setOwner}
            />

            <Text style={styles.inputLabel}>Historial Clínico Inicial / Observaciones</Text>
            <TextInput 
              style={[styles.input, styles.textArea]} 
              placeholder="Ingrese alergias, vacunas previas, o estado actual del animal..." 
              multiline={true}
              numberOfLines={4}
              value={history}
              onChangeText={setHistory}
            />

            <TouchableOpacity style={styles.submitButton} onPress={handleAddPet}>
              <Text style={styles.submitButtonText}>Guardar Registro</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

// --- SCREEN 3: AGRO-VETERINARY STORE --- 
function StoreScreen() {
  const { products, addToCart } = useContext(AppContext);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Todos');

  const handleAddToCart = (product) => {
    addToCart(product);
    Alert.alert('Añadido al Carrito', `${product.name} se ha agregado a tu carrito.`);
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                          p.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'Todos' || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <View style={styles.screenContainer}>
      <Text style={styles.screenTitle}>Tienda Agro-Veterinaria</Text>
      
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Search color="#757575" size={20} />
        <TextInput 
          style={styles.searchInput} 
          placeholder="Buscar alimentos, insumos, medicinas..." 
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Categories Horizontal */}
      <View style={styles.storeFilterContainer}>
        {['Todos', 'Mascotas', 'Agro', 'Medicamentos'].map((cat) => (
          <TouchableOpacity 
            key={cat} 
            style={[styles.storeFilterButton, categoryFilter === cat && styles.storeFilterButtonActive]}
            onPress={() => setCategoryFilter(cat)}
          >
            <Text style={[styles.storeFilterText, categoryFilter === cat && styles.storeFilterTextActive]}>
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Products Grid */}
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.productRow}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.productCard}>
            <Image source={{ uri: item.image }} style={styles.productImage} />
            <View style={styles.productInfo}>
              <Text style={styles.productCategory}>{item.category.toUpperCase()}</Text>
              <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
              <Text style={styles.productPrice}>${item.price.toFixed(2)} USD</Text>
              <TouchableOpacity 
                style={styles.productButton}
                onPress={() => handleAddToCart(item)}
              >
                <Text style={styles.productButtonText}>Agregar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <ShoppingBag color="#BDBDBD" size={48} />
            <Text style={styles.emptyStateText}>No se encontraron productos.</Text>
          </View>
        }
      />
    </View>
  );
}

// --- SCREEN 4: APPOINTMENTS AGENDA ---
function AgendaScreen() {
  const { appointments, addAppointment } = useContext(AppContext);
  const [modalVisible, setModalVisible] = useState(false);

  // Form State
  const [petName, setPetName] = useState('');
  const [type, setType] = useState('Clínica');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [reason, setReason] = useState('');

  const handleBookAppointment = () => {
    if (!petName || !date || !time || !reason) {
      Alert.alert('Campos incompletos', 'Por favor complete todos los campos de la cita.');
      return;
    }
    addAppointment({ petName, type, date, time, reason });
    setModalVisible(false);
    // Reset
    setPetName('');
    setType('Clínica');
    setDate('');
    setTime('');
    setReason('');
    Alert.alert('Cita Agendada', 'Su cita ha sido registrada con éxito.');
  };

  return (
    <View style={styles.screenContainer}>
      <View style={styles.screenHeaderRow}>
        <Text style={styles.screenTitle}>Agenda de Citas</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
          <Plus color="#FFFFFF" size={18} />
          <Text style={styles.addButtonText}>Nueva Cita</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={appointments}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.appointmentCard}>
            <View style={styles.appointmentHeader}>
              <View style={styles.appointmentBadgeContainer}>
                <View style={[styles.statusIndicator, item.type === 'Clínica' ? styles.statusClinic : styles.statusField]} />
                <Text style={styles.appointmentTypeText}>{item.type}</Text>
              </View>
              <Text style={styles.appointmentDateText}>{item.date} - {item.time}</Text>
            </View>
            <Text style={styles.appointmentTitleText}>Paciente / Lote: {item.petName}</Text>
            <Text style={styles.appointmentReasonText}>Motivo: {item.reason}</Text>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Calendar color="#BDBDBD" size={48} />
            <Text style={styles.emptyStateText}>No tienes citas programadas.</Text>
          </View>
        }
      />

      {/* BOOK APPOINTMENT MODAL */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <ScrollView style={styles.modalContent} contentContainerStyle={{ paddingBottom: 40 }}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Programar Cita / Visita</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X color="#333" size={24} />
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>Tipo de Servicio</Text>
            <View style={styles.selectorContainer}>
              <TouchableOpacity 
                style={[styles.selectorButton, type === 'Clínica' && styles.selectorButtonActive]} 
                onPress={() => setType('Clínica')}
              >
                <Text style={[styles.selectorText, type === 'Clínica' && styles.selectorTextActive]}>Consulta Clínica</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.selectorButton, type === 'Visita de Campo' && styles.selectorButtonActive]} 
                onPress={() => setType('Visita de Campo')}
              >
                <Text style={[styles.selectorText, type === 'Visita de Campo' && styles.selectorTextActive]}>Visita de Campo</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>Nombre Mascota o Lote de Ganado</Text>
            <TextInput 
              style={styles.input} 
              placeholder="Ej. Max, Lote Vacas Lecheras" 
              value={petName}
              onChangeText={setPetName}
            />

            <Text style={styles.inputLabel}>Fecha (AAAA-MM-DD)</Text>
            <TextInput 
              style={styles.input} 
              placeholder="Ej. 2024-11-25" 
              value={date}
              onChangeText={setDate}
            />

            <Text style={styles.inputLabel}>Hora (Ej: 10:00 AM)</Text>
            <TextInput 
              style={styles.input} 
              placeholder="Ej. 10:00 AM" 
              value={time}
              onChangeText={setTime}
            />

            <Text style={styles.inputLabel}>Motivo de la Consulta / Visita</Text>
            <TextInput 
              style={[styles.input, styles.textArea]} 
              placeholder="Describa brevemente el motivo o síntomas..." 
              multiline={true}
              numberOfLines={3}
              value={reason}
              onChangeText={setReason}
            />

            <TouchableOpacity style={styles.submitButton} onPress={handleBookAppointment}>
              <Text style={styles.submitButtonText}>Agendar Cita</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

// --- STYLES --- 
const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#1B5E20',
    paddingHorizontal: 20,
    paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  headerSubtitle: {
    color: '#A5D6A7',
    fontSize: 12,
    fontWeight: '600',
  },
  cartButton: {
    position: 'relative',
    padding: 8,
  },
  cartBadge: {
    position: 'absolute',
    right: 0,
    top: 0,
    backgroundColor: '#FF6D00',
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  navBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingVertical: 8,
    justifyContent: 'space-around',
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  navItemActive: {
    backgroundColor: '#E8F5E9',
  },
  navText: {
    fontSize: 11,
    color: '#757575',
    marginTop: 4,
    fontWeight: '500',
  },
  navTextActive: {
    color: '#2E7D32',
    fontWeight: 'bold',
  },

  // Dashboard Styles
  scrollContainer: {
    padding: 16,
  },
  heroBanner: {
    backgroundColor: '#E8F5E9',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  heroTextContainer: {
    flex: 1,
    paddingRight: 8,
  },
  heroTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1B5E20',
    marginBottom: 4,
  },
  heroSubtitle: {
    fontSize: 13,
    color: '#4E6952',
    marginBottom: 12,
  },
  heroButton: {
    backgroundColor: '#2E7D32',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  heroButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  heroImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    width: '48%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginVertical: 4,
  },
  statLabel: { 
    fontSize: 12,
    color: '#757575',
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 12,
  },
  seeMoreText: {
    color: '#2E7D32',
    fontWeight: 'bold',
    fontSize: 13,
  },
  servicesScroll: {
    marginBottom: 24,
  },
  serviceCard: {
    backgroundColor: '#FFFFFF',
    width: 170,
    padding: 16,
    borderRadius: 12,
    marginRight: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#2E7D32',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  serviceCardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333333',
    marginTop: 8,
    marginBottom: 4,
  },
  serviceCardDesc: {
    fontSize: 11,
    color: '#757575',
    lineHeight: 15,
  },
  appointmentPreviewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  appointmentIconContainer: {
    backgroundColor: '#E8F5E9',
    padding: 10,
    borderRadius: 8,
    marginRight: 12,
  },
  appointmentDetails: {
    flex: 1,
  },
  appointmentPet: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333333',
  },
  appointmentType: {
    fontSize: 12,
    color: '#616161',
  },
  appointmentTimeText: {
    fontSize: 11,
    color: '#757575',
    marginTop: 2,
  },

  // Screens General
  screenContainer: {
    flex: 1,
    padding: 16,
  },
  screenHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  screenTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1B5E20',
  },
  addButton: {
    backgroundColor: '#2E7D32',
    flexDirection: 'row',
    alignItems: 'center', 
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  tabFilterContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  tabFilterButton: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#E0E0E0',
    marginRight: 8,
  },
  tabFilterButtonActive: {
    backgroundColor: '#2E7D32',
  },
  tabFilterText: {
    fontSize: 12,
    color: '#616161',
    fontWeight: '500',
  },
  tabFilterTextActive: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },

  // Pet Card Styles
  petCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  petCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
    paddingBottom: 8,
    marginBottom: 8,
  },
  petNameText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  petTypeText: {
    fontSize: 12,
    color: '#757575',
  },
  badge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  badgePet: {
    backgroundColor: '#E0F7FA',
  },
  badgeLivestock: {
    backgroundColor: '#FFF3E0',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#333333',
  },
  petCardBody: {
    marginTop: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#616161',
    marginLeft: 6,
  },
  infoValue: {
    fontSize: 12,
    color: '#333333',
  },
  clinicalHistoryContainer: {
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    padding: 10,
    marginTop: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#00838F',
  },
  clinicalHistoryTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#00838F',
    marginBottom: 2,
  },
  clinicalHistoryText: {
    fontSize: 12,
    color: '#424242',
    fontStyle: 'italic',
  },

  // Store Styles
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: '#333333',
  },
  storeFilterContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  storeFilterButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
    marginRight: 6,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  storeFilterButtonActive: {
    backgroundColor: '#00838F',
    borderColor: '#00838F',
  },
  storeFilterText: {
    fontSize: 11,
    color: '#616161',
    fontWeight: '500',
  },
  storeFilterTextActive: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  productRow: {
    justifyContent: 'space-between',
  },
  productCard: {
    backgroundColor: '#FFFFFF',
    width: '48%',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  productImage: {
    width: '100%',
    height: 110,
    resizeMode: 'cover',
  },
  productInfo: {
    padding: 10,
  },
  productCategory: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#00838F',
    marginBottom: 2,
  },
  productName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333333',
    height: 34,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#EF6C00',
    marginVertical: 4,
  },
  productButton: {
    backgroundColor: '#2E7D32',
    paddingVertical: 6,
    borderRadius: 6,
    alignItems: 'center',
  },
  productButtonText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
  },

  // Agenda Styles
  appointmentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#2E7D32',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  appointmentBadgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusClinic: {
    backgroundColor: '#00838F',
  },
  statusField: {
    backgroundColor: '#EF6C00',
  },
  appointmentTitleText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  appointmentReasonText: {
    fontSize: 12,
    color: '#616161',
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    paddingBottom: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#616161',
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#333333',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  selectorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  selectorButton: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  selectorButtonActive: {
    backgroundColor: '#E8F5E9',
    borderColor: '#2E7D32',
  },
  selectorText: {
    fontSize: 12,
    color: '#616161',
    fontWeight: '500',
  },
  selectorTextActive: {
    color: '#2E7D32',
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: '#2E7D32',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },

  // Cart Modal Styles
  cartModalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  emptyCart: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyCartText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#616161',
    marginTop: 12,
  },
  emptyCartSub: {
    fontSize: 12,
    color: '#9E9E9E',
    marginTop: 4,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  cartItemImage: {
    width: 50,
    height: 50,
    borderRadius: 6,
    marginRight: 12,
  },
  cartItemDetails: {
    flex: 1,
  },
  cartItemName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#333333',
  },
  cartItemCategory: {
    fontSize: 10,
    color: '#00838F',
    fontWeight: '500',
  },
  cartItemPrice: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#EF6C00',
  },
  cartItemRemove: {
    padding: 8,
  },
  cartSummary: {
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    paddingTop: 16,
    marginTop: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  summaryLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#616161',
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  checkoutButton: {
    backgroundColor: '#2E7D32',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    color: '#757575',
    fontSize: 14,
    marginTop: 12,
  }
});